/**
 * OLA provider specific operations
 */
export const OlaProvider = {
  /**
   * Converts a date from DD-MM-YYYY format to YYYY-MM-DD format
   * @param {string} dayMonthYear - Date in DD-MM-YYYY format
   * @returns {string} Date in YYYY-MM-DD format
   */
  olaDateFormat: (dayMonthYear) => {
    if (!dayMonthYear) return "";
    const [day, month, year] = dayMonthYear.split("-");
    return `${year}-${month}-${day}`;
  },

  /**
   * Groups response by unique keys to remove duplicates
   * @param {Array} mappedResponse - Array of response objects
   * @param {string} criteria - Grouping criteria
   * @returns {Array} Deduplicated array
   */
  grouper: (mappedResponse, criteria = null) => {
    if (!mappedResponse || !Array.isArray(mappedResponse)) return [];

    const uniqueResponse = [];
    const seenItems = new Set();

    mappedResponse.forEach((item) => {
      if (!item) return;

      let uniqueKey;
      if (criteria) {
        uniqueKey = `${item[criteria]}`;
      } else if (item.departures?.[0]?.hotels?.[0]) {
        const hotel = item.departures[0].hotels[0];
        uniqueKey = `${item.id}-${hotel.name}-${hotel.roomType}-${hotel.roomSize}-${hotel.mealPlan}`;
      } else {
        uniqueKey = `${item.id}-${Date.now()}-${Math.random()}`;
      }

      if (!seenItems.has(uniqueKey)) {
        seenItems.add(uniqueKey);
        uniqueResponse.push(item);
      }
    });

    return uniqueResponse;
  },

  /**
   * Generates XML for room configuration
   * @param {Array} roomsConfig - Room configuration array
   * @returns {string} XML string
   */
  generateXMLRoomsByConfigString: (roomsConfig) => {
    if (!roomsConfig || !Array.isArray(roomsConfig)) return "<Rooms></Rooms>";

    const roomStrings = roomsConfig.map((room) => {
      if (!room) return "";

      const adultStrings = Array(room.adults || 0)
        .fill('    <Passenger Type="ADL"/>')
        .join("\n");

      const childStrings = (room.children || [])
        .map((age) => `    <Passenger Type="CHD" Age="${age}"/>`)
        .join("\n");

      return `  <Room>\n${adultStrings}${adultStrings && childStrings ? "\n" : ""}${childStrings}\n  </Room>`;
    });

    return `<Rooms>\n${roomStrings.join("\n")}\n</Rooms>`;
  },
};
