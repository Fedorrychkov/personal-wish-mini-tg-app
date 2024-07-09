import { Autocomplete, createFilterOptions, FormControl, FormHelperText, TextField } from '@mui/material'
import { forwardRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { RegisterField } from '~/hooks'

const filter = createFilterOptions<any>()

type Props = {
  label?: string
  className?: string
  fullWidth?: boolean
  isLoading?: boolean
  options: { inputValue: string; title: string; [key: string]: unknown }[]
  disabled?: boolean
  id?: string
  noOptionsText?: string
  realValue?: any
} & RegisterField

// TODO: Селект должен работать с определенным стандартом options, а не только со строковым представлением

export const AutocompleteFieldContainer = forwardRef((props: Props) => {
  const { id, className, realValue, label, disabled, fullWidth, options = [], noOptionsText, ...field } = props
  const { watch } = useFormContext()

  const value = realValue || watch(field.name)

  return (
    <Controller
      {...field}
      render={({ field: { onChange: defaultOnChange } }) => (
        <FormControl fullWidth className="mt-3">
          <Autocomplete
            disablePortal
            id={id}
            options={options}
            value={value}
            fullWidth={fullWidth}
            disabled={disabled}
            className={className || 'w-full'}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                defaultOnChange(newValue)
              } else if (newValue && newValue.id) {
                defaultOnChange(newValue)
              } else if (newValue && newValue.inputValue) {
                defaultOnChange(newValue.inputValue)
              } else {
                defaultOnChange(newValue)
              }
            }}
            selectOnFocus
            clearOnBlur
            getOptionLabel={(option) => {
              // for example value selected with enter, right from the input
              if (typeof option === 'string') {
                return option
              }

              if (option.inputValue) {
                return option.inputValue
              }

              return option.title
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props as any

              return (
                <li key={key} {...optionProps}>
                  {option.title}
                </li>
              )
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params)

              if (params.inputValue !== '') {
                filtered.push({
                  inputValue: params.inputValue,
                  title: `Добавить "${params.inputValue}"`,
                })
              }

              return filtered
            }}
            noOptionsText={noOptionsText}
            renderInput={(params) => <TextField {...params} label={label} error={field?.error} />}
          />
          {field?.error && <FormHelperText error>{field?.helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  )
})

AutocompleteFieldContainer.displayName = 'AutocompleteFieldContainer'
