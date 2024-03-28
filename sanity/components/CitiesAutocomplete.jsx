import { SearchIcon } from "@sanity/icons";
import { Autocomplete, Avatar, Box, Card, Flex, Text } from "@sanity/ui";

export const CitiesAutocomplete = (props) => {
  return (
    <Card padding={[3, 3, 4]}>
      <Autocomplete
        // custom search filter
        filterOption={(query, option) =>
          option.payload.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        }
        fontSize={[2, 2, 3]}
        icon={SearchIcon}
        openButton
        // options with `payload`
        options={[
          {
            value: "argentina",
            payload: {
              color: "purple",
              userId: "mikolajdobrucki",
              name: "Mikołaj Dobrucki",
              imageUrl: "https://avatars.githubusercontent.com/u/5467602?v=4",
            },
          },
          {
            value: "mariuslundgard",
            payload: {
              color: "blue",
              userId: "mariuslundgard",
              name: "Marius Lundgård",
              imageUrl: "https://avatars.githubusercontent.com/u/406933?v=4",
            },
          },
          {
            value: "vicbergquist",
            payload: {
              color: "cyan",
              userId: "vicbergquist",
              name: "Victoria Bergquist",
              imageUrl: "https://avatars.githubusercontent.com/u/25737281?v=4",
            },
          },
        ]}
        padding={[3, 3, 4]}
        placeholder="Type to find user …"
        // custom option render function
        renderOption={(option) => (
          <Card as="button" aria-label="Botón">
            <Flex align="center">
              <Box padding={1}>
                <Avatar
                  color={option.payload.color}
                  size={1}
                  src={option.payload.imageUrl}
                />
              </Box>
              <Box flex={1} padding={2} paddingLeft={1}>
                <Text size={[2, 2, 3]}>{option.payload.color}</Text>
              </Box>
            </Flex>
          </Card>
        )}
        // custom value render function
        renderValue={(value, option) => option?.payload.name || value}
      />
    </Card>
  );
};
