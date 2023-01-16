import dynamic from 'next/dynamic';
import {
  Radio,
  RadioGroup,
  Divider,
  Flex,
  Box,
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import { SortNFilterProps } from 'types';
import { Select as ChakraSelect } from 'chakra-react-select';
import { FiFilter } from 'react-icons/fi';
const Popover = dynamic(() => import('components/common/Popover'));
const NumberInput = dynamic(() => import('components/common/Input/NumberInput'))

interface MultiSelectType {
  option: any;
  value: string[];
  handleOption: any;
}

interface CheckType {
  option: any;
  value: boolean;
  handleOption: any;
}

interface MultiInputType {
  option: any;
  value: any;
  handleOption: any;
}

const MultiSelectMenuComponent = ({ option, value, handleOption }: MultiSelectType) => {
  const getOptions = (items: string[]) => items.map((item: string) => ({
    label: item,
    value: item
  }));

  const multiOptions = getOptions(option.items);

  const values = getOptions(value);

  return (
    <ChakraSelect
      isMulti
      options={multiOptions}
      value={values}
      onChange={(e: any) => {
        handleOption(option.key, e.map((item: any) => item.value));
      }}
      selectedOptionStyle="check"
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
    />
  );
}

const MultiSelectRowComponent = ({ option, value, handleOption }: MultiSelectType) => {
  return (
    <Flex>
      <Box minWidth={'100px'}>
        <p>{option.text}</p>
      </Box>
      <CheckboxGroup defaultValue={value} onChange={(e: any) => handleOption(option.key, e)}>
        <Stack direction={['column', 'row']}>
          {option.items.map((label: string, index: number) => (
            <Checkbox value={label} key={index}>
              {label}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </Flex>
  );
}

const CheckComponent = ({ option, value, handleOption }: CheckType) => {
  return (
    <Checkbox isChecked={value} onChange={(e: any) => {
      handleOption(option.key, e.target.checked)
    }}>
      {option.text}
    </Checkbox>
  );
}

const MultiInputComponent = ({ option, value, handleOption }: MultiInputType) => {
  return (
    <Flex flexDirection={'column'} gap={4}>
      <Checkbox
        isChecked={value.enabled}
        onChange={(e: any) => {
          handleOption(option.key, { ...value, enabled: e.target.checked })
        }}>
        <p>{option.text}</p>
      </Checkbox>
      <Flex gap={2} display={value.enabled ? 'flex' : 'none'}>
        <NumberInput
          step={1}
          label='From'
          value={value.minValue}
          handleChange={(e: any) => handleOption(option.key, { ...value, minValue: Number(e) })} />
        <NumberInput
          step={1}
          label='To'
          value={value.maxValue}
          handleChange={(e: any) => handleOption(option.key, { ...value, maxValue: Number(e) })} />
      </Flex>
    </Flex>
  )
}

const SortNFilter = ({ option, value, handleOption, ...rest }: SortNFilterProps) => {
  const { sortOptions, filterOptions } = option;
  return (
    <Popover isIcon icon={<FiFilter />} ariaLabel="sort_filter" {...rest}>
      <Flex flexDirection={'column'} gap={2}>
        <RadioGroup
          onChange={(e: string) => handleOption("sortValue", e)}
          value={value["sortValue"]}
          width={'100%'}
        >
          {sortOptions.map((suboption: any, index: number) => (
            <Flex key={index}>
              <Box minWidth={'100px'}>
                <p>{suboption.text}</p>
              </Box>
              <Flex flexWrap={'wrap'} justifyContent={'flex-start'}>
                {suboption.items.map((label: string, subindex: number) => (
                  <Box marginRight={'10px'} key={subindex}>
                    <Radio value={(2 * index + subindex).toString()}>
                      {label}
                    </Radio>
                  </Box>
                ))}
              </Flex>
            </Flex>
          ))}
        </RadioGroup>
        <Divider display={filterOptions.length === 0 ? 'none' : 'block'} />
        {filterOptions.map((suboption: any, index: any) => (
          <Flex key={index}>
            {suboption.type === "multiselect-menu" &&
              <MultiSelectMenuComponent
                option={suboption}
                value={value[suboption.key]}
                handleOption={handleOption}
              />
            }
            {suboption.type === "multiselect-row" &&
              <MultiSelectRowComponent
                option={suboption}
                value={value[suboption.key]}
                handleOption={handleOption}
              />
            }
            {suboption.type === "check" &&
              <CheckComponent
                option={suboption}
                value={value[suboption.key]}
                handleOption={handleOption}
              />
            }
            {suboption.type === "multiinput" &&
              <MultiInputComponent
                option={suboption}
                value={value[suboption.key]}
                handleOption={handleOption}
              />
            }
          </Flex>
        ))}
      </Flex>
    </Popover >
  )
}

export default SortNFilter
