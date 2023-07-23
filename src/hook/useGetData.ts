import { Model, data as ServerData, marketPriority, searchMethodFeatureFlag } from "../services/SearchService";

const cacheTimeout = 24 * 7 * 60 * 60 * 1000;


interface Storage {
    savedTime: number,
    data: Model[],
    indexedByName: IndexSearch,
    indexedByType: IndexSearch,
}

export type IndexSearch = Record<string, number[]>;

export type CachedData = Omit<Storage, 'savedTime'>;

const localStorageKey = 'cachedData';

function useGetData(): CachedData {
    const currentDate = new Date();
    const dataStr = localStorage.getItem(localStorageKey);
    let data: Storage;
  
    if (!dataStr) {
      const sortedData = sortServerData(ServerData);  
      data = {
        savedTime: currentDate.getTime(),
        data: sortServerData(ServerData),
        indexedByName: getIndexedArrayByProperty(sortedData, 'name'),
        indexedByType: getIndexedArrayByProperty(sortedData, 'type')
      };
      
      localStorage.setItem(localStorageKey, JSON.stringify(data));
    } else {
      data = JSON.parse(dataStr);
      if (data.savedTime < currentDate.getTime() + cacheTimeout) {
        localStorage.clear();
        data.data = sortServerData(ServerData);
        data.savedTime = currentDate.getTime();
        data.indexedByName =  (searchMethodFeatureFlag === "FullNameIndex") ? 
          getIndexedArrayByProperty(data.data, 'name') : getPartialIndexedArrayForName(data.data);
        data.indexedByType = getIndexedArrayByProperty(data.data, 'type');
        localStorage.setItem(localStorageKey, JSON.stringify(data));
      }
    }

    return {
        data: data.data,
        indexedByName: data.indexedByName,
        indexedByType: data.indexedByType
    };
  }

const sortServerData = (data: Model[]): Model[] => {
    data.sort((itemA, itemB) => {
        if (marketPriority[itemA.market] === marketPriority[itemB.market]) {
            return  (Math.abs(itemA.i.price.high - itemA.i.price.lastTradedPrevious))
                        - Math.abs((itemB.i.price.high - itemB.i.price.lastTradedPrevious))
        } else {
            return marketPriority[itemA.market] - marketPriority[itemB.market]
        }
    })
    return data;
}

const getIndexedArrayByProperty = (data: Model[], property: 'name' | 'type'): IndexSearch => {
    const indexed: IndexSearch = {};
    return data.reduce((acc, current, index) => {
        const key = current.i[property].toLowerCase();
        if (acc.hasOwnProperty(key)) acc[key].push(index);
            else acc[key] = [index]
        return acc;
    }, indexed);
}

const getPartialIndexedArrayForName = (data: Model[]): IndexSearch => {
  const nameIndex: IndexSearch = {};

  data.forEach((item, itemIndex) => {
    const name = item.i.name.toLowerCase();
    for (let i = 0; i < name.length; i++) {
      for (let j = i + 2; j <= name.length; j++) { // Minimal search string 2 symbols
        const substring = name.slice(i, j);
        if (!nameIndex[substring]) {
          nameIndex[substring] = [];
        }
        nameIndex[substring].push(itemIndex);
      }
    }
  });
  return nameIndex;
}


export default useGetData;