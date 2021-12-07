import PropTypes from 'prop-types';

const Fieldset = ({ children, isFieldset }) => {
  if (isFieldset) {
    return <fieldset disabled>{children}</fieldset>;
  }

  return <>{children}</>;
};

Fieldset.propTypes = {
  children: PropTypes.element,
  isFieldset: PropTypes.bool,
};

export default Fieldset;
