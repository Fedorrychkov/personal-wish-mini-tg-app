import {
  Autocomplete,
  createFilterOptions,
  FormControl,
  FormHelperText,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { forwardRef, KeyboardEvent, useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { RegisterField } from '~/hooks'
import { AnyString } from '~/types'

import { useKeyboardAppended } from '../hook'

const filter = createFilterOptions<any>()

type Props = {
  label?: string
  className?: string
  fullWidth?: boolean
  isLoading?: boolean
  options: { inputValue: AnyString; title: AnyString; [key: string]: unknown }[]
  disabled?: boolean
  id?: string
  noOptionsText?: string
  realValue?: any
  textFielProps?: TextFieldProps
} & RegisterField

export const AutocompleteFieldContainer = forwardRef((props: Props) => {
  const {
    className,
    realValue,
    label,
    disabled,
    fullWidth,
    options = [],
    textFielProps,
    noOptionsText,
    ...field
  } = props
  const { watch } = useFormContext()

  const { blurHandler, focusHandler } = useKeyboardAppended()

  const value = realValue || watch(field.name)

  const handlePressKey = useCallback(
    (onChange: any) => (e: KeyboardEvent<HTMLInputElement>) => {
      const keyCode = e.which || e.keyCode

      if (keyCode === 13) {
        e.preventDefault()
        e.stopPropagation()

        if (e.target instanceof HTMLInputElement) {
          const value = e?.target?.value

          const found = options?.find((option) => option?.title?.toLowerCase() === value?.toLowerCase())

          if (!found) {
            onChange?.(value)
          } else {
            onChange?.(found)
          }
        }

        textFielProps?.onKeyDown?.(e)

        return false
      }
    },
    [textFielProps, options],
  )

  return (
    <Controller
      {...field}
      render={({ field: { onChange: defaultOnChange } }) => (
        <FormControl fullWidth className="mt-3">
          <Autocomplete
            disablePortal
            id={field.name}
            options={options}
            value={value}
            fullWidth={fullWidth}
            disabled={disabled}
            onFocus={focusHandler}
            onBlur={blurHandler}
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
            renderInput={(params) => (
              <TextField
                {...params}
                name={field.name}
                label={label}
                InputLabelProps={{
                  ...params.InputLabelProps,
                  className: 'dark:!text-slate-200',
                }}
                InputProps={{
                  ...params.InputProps,
                  className: 'dark:!text-slate-200',
                  onKeyDown: handlePressKey(defaultOnChange),
                }}
                error={field?.error}
              />
            )}
          />
          {field?.error && <FormHelperText error>{field?.helperText}</FormHelperText>}
        </FormControl>
      )}
    />
  )
})

AutocompleteFieldContainer.displayName = 'AutocompleteFieldContainer'
