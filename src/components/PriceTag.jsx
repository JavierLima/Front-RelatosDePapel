function PriceTag({ price }) {
    return (
        <span className="price-tag">{price.toFixed(2)} €</span>
    )
}

export default PriceTag
