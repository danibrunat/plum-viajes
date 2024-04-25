"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const destinations = [
  { id: 1, code: "MDQ", name: "Mar del Plata, Argentina" },
  { id: 2, code: "SAO", name: "San Pablo, Brasil" },
  { id: 3, code: "DOM", name: "Dominicana, República Dominicana" },
  { id: 4, code: "RIO", name: "Rio de Janeiro, Brasil" },
];

export default function Autocomplete() {
  const [selected, setSelected] = useState(destinations[0]);
  const [query, setQuery] = useState("");

  const filteredDestinations =
    query === ""
      ? destinations
      : destinations.filter((city) =>
          city.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full md:w-72">
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg  text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full border-none py-1 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                displayValue={(city) => city.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredDestinations.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    No encontramos el destino. Probá uno diferente.
                  </div>
                ) : (
                  filteredDestinations.map((city) => (
                    <Combobox.Option
                      key={city.id}
                      className={({ active }) =>
                        `relative cursor-default select-none bg-white py-2 pl-10 pr-4 ${
                          active ? " text-plumPrimaryPink" : "text-gray-900"
                        }`
                      }
                      value={city}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {city.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
}
