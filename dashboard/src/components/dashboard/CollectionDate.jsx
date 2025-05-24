import React from 'react';

const CollectionDate = () => {
  return (
    <section className="card collection-date">
      <h3 className="card__title">Next Collection Date</h3>
      <div className="collection-date__content">
        <div className="collection-date__main">
          <span className="collection-date__day">3</span>
          <span className="collection-date__superscript">rd</span>
          <span className="collection-date__month-year"> March 2025</span>
        </div>
        <div className="collection-date__label">Tomorrow</div>
      </div>
    </section>
  );
};

export default CollectionDate;