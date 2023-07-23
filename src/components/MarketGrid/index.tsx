import { Model } from "../../services";
import './styles.css'

interface Props {
    markets: Model[]
}

function MarketGrid({ markets }: Props) {
    const format = new Intl.NumberFormat().format;
    return (
        <div style={{marginTop: '1rem'}}>
            <div style={{ display: 'flex'}}>
                <div style={{ width: '200px'}}>Name</div>
                <div style={{ width: '100px' }}>Market</div>
                <div style={{ width: '200px' }}>Price</div>
            </div>
            <div className="scrolling-container">
            {markets.map((market) => (
                <div style={{ display: 'flex' }} key={market.id}>
                    <div style={{ width: '200px' }}>{`${market.i.name}_${market.i.type}`}</div>
                    <div style={{ width: '100px' }}>{market.market}</div>
                    <div style={{ width: '200px' }}>{format(parseInt(market.i.lotSize) * market.i.price.lastTradedPrevious)} ({market.i.price.high - market.i.price.lastTradedPrevious})</div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default MarketGrid;