import PricingCard from "./pricingCard";

const PricingSection = ({ cards }) => {
  return (
    <section className="py-6 px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 justify-items-center">
        {cards.map((card, index) => (
          <PricingCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
