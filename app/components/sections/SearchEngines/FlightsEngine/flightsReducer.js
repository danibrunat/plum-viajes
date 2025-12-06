/**
 * Initial state for the flights search form
 */
export const initialFlightsState = {
  // Route
  origin: "",
  destination: "",
  dateRange: [null, null],
  
  // Options
  tripType: "roundTrip",
  flexible: false,
  business: false,
  priceInUsd: false,
  
  // Passengers
  passengers: {
    adults: 1,
    children: 0,
    babies: 0,
  },
  showPassengersModal: false,
  
  // Multi-trip legs
  legs: [{ origin: "", destination: "", date: "" }],
};

/**
 * Action types for the flights reducer
 */
export const FLIGHTS_ACTIONS = {
  SET_ORIGIN: "SET_ORIGIN",
  SET_DESTINATION: "SET_DESTINATION",
  SET_DATE_RANGE: "SET_DATE_RANGE",
  SET_TRIP_TYPE: "SET_TRIP_TYPE",
  SET_FLEXIBLE: "SET_FLEXIBLE",
  SET_BUSINESS: "SET_BUSINESS",
  SET_PRICE_IN_USD: "SET_PRICE_IN_USD",
  UPDATE_PASSENGER: "UPDATE_PASSENGER",
  TOGGLE_PASSENGERS_MODAL: "TOGGLE_PASSENGERS_MODAL",
  ADD_LEG: "ADD_LEG",
  UPDATE_LEG: "UPDATE_LEG",
  REMOVE_LEG: "REMOVE_LEG",
  SET_FIELD: "SET_FIELD",
};

/**
 * Reducer for managing flights search form state
 * @param {Object} state - Current state
 * @param {Object} action - Action with type and payload
 * @returns {Object} New state
 */
export function flightsReducer(state, action) {
  switch (action.type) {
    case FLIGHTS_ACTIONS.SET_ORIGIN:
      return { ...state, origin: action.payload };

    case FLIGHTS_ACTIONS.SET_DESTINATION:
      return { ...state, destination: action.payload };

    case FLIGHTS_ACTIONS.SET_DATE_RANGE:
      return { ...state, dateRange: action.payload };

    case FLIGHTS_ACTIONS.SET_TRIP_TYPE:
      return { ...state, tripType: action.payload };

    case FLIGHTS_ACTIONS.SET_FLEXIBLE:
      return { ...state, flexible: action.payload };

    case FLIGHTS_ACTIONS.SET_BUSINESS:
      return { ...state, business: action.payload };

    case FLIGHTS_ACTIONS.SET_PRICE_IN_USD:
      return { ...state, priceInUsd: action.payload };

    case FLIGHTS_ACTIONS.UPDATE_PASSENGER: {
      const { passengerType, value } = action.payload;
      return {
        ...state,
        passengers: {
          ...state.passengers,
          [passengerType]: Math.max(0, state.passengers[passengerType] + value),
        },
      };
    }

    case FLIGHTS_ACTIONS.TOGGLE_PASSENGERS_MODAL:
      return { 
        ...state, 
        showPassengersModal: action.payload ?? !state.showPassengersModal 
      };

    case FLIGHTS_ACTIONS.ADD_LEG:
      return {
        ...state,
        legs: [...state.legs, { origin: "", destination: "", date: "" }],
      };

    case FLIGHTS_ACTIONS.UPDATE_LEG: {
      const { index, field, value } = action.payload;
      return {
        ...state,
        legs: state.legs.map((leg, i) =>
          i === index ? { ...leg, [field]: value } : leg
        ),
      };
    }

    case FLIGHTS_ACTIONS.REMOVE_LEG:
      return {
        ...state,
        legs: state.legs.filter((_, i) => i !== action.payload),
      };

    case FLIGHTS_ACTIONS.SET_FIELD:
      return { ...state, [action.payload.field]: action.payload.value };

    default:
      return state;
  }
}
