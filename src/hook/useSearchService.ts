import { Model, searchMethodFeatureFlag } from "../services/SearchService";
import useGetData, { IndexSearch } from "./useGetData";

interface Params {
    search: string,
    page: number,
}

const searchStorage = 'searchStorage';

const pageLimit = 50;

interface ReturnType {
    result: Model[],
    totalPages: number,
    totalItems: number,
}

function useSearchService({ search, page }: Params): ReturnType {
    const data = useGetData();

    if (search.length < 2) {
        return {
            result: data.data.slice((page - 1) * pageLimit, page * pageLimit),
            totalPages: Math.ceil(data.data.length / pageLimit),
            totalItems: data.data.length,
        }
    }
    

    const cachedResult = localStorage.getItem(searchStorage);

    let parsedResults: Record<string, number[]> = {};
    if (cachedResult) {
        parsedResults = JSON.parse(cachedResult);
    }

    if(parsedResults[search]) {
        return {
            result: getDataForPage(data.data, parsedResults[search], page),
            totalPages: Math.ceil(parsedResults[search].length / pageLimit),
            totalItems: parsedResults[search].length,
        }
    }

    const result = searchMethodFeatureFlag === "FullNameIndex"
                        ? [...new Set(searchForIndexes(search, {...data.indexedByName, ...data.indexedByType}))]
                        : [...new Set(searchForIndexes(search, data.indexedByType).concat(data.indexedByName[search]))];

    parsedResults[search] = result.sort((a, b) => a - b);
    localStorage.setItem(searchStorage, JSON.stringify(parsedResults));
    return {
        result: getDataForPage(data.data, parsedResults[search], page),
        totalPages: Math.ceil(result.length / pageLimit),
        totalItems: result.length
    }
}

function searchForIndexes(search: string, indexes: IndexSearch) :number[] {
    let result: number[] = [];
    for (const property in indexes) {
        if (property.includes(search.toLowerCase())) {
            result = result.concat(indexes[property])
        }
    }
    return result;
}

function getDataForPage(data: Model[], indexes: number[], page: number) {
    const first = (page - 1) * pageLimit;
    const last = page * pageLimit < indexes.length ? page * pageLimit : indexes.length;
    const result: Model[] = [];
    for (let i = first; i < last; i ++ ){
        result.push(data[indexes[i]]);
    }
    return result;
}

export default useSearchService;