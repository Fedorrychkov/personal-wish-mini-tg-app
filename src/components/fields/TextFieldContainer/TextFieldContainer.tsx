import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material'
import isNil from 'lodash/isNil'
import { forwardRef, MouseEvent, ReactNode, useState } from 'react'
import { Controller, RefCallBack, useFormContext } from 'react-hook-form'

import { RegisterField } from '~/hooks'
import { cn } from '~/utils'

type Props = {
  placeholder?: string
  label?: string
  preventDisabled?: boolean
  type?: string
  className?: string
  fullWidth?: boolean
  endAdornment?: ReactNode
  hint?: string
  inputClassName?: string
  textFieldProps?: TextFieldProps
} & RegisterField

/**
 * Importand to use inside react form hook FormProvider
 */
export const TextFieldContainer = forwardRef((props: Props, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  const { watch } = useFormContext()
  const {
    className,
    type = 'text',
    label,
    disabled,
    preventDisabled,
    fullWidth,
    endAdornment = null,
    hint,
    inputClassName,
    textFieldProps,
    ...field
  } = props

  /**
   * Это свойство нужно оборачивать в отслеживаемое
   * _
   * Если так не делать, то из-за вложенности компонентов может случится такое,
   * что formState.isDirty не будет изменяться по мере изменений в полях ввода
   */
  const value = watch(field.name)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const isTextarea = type === 'textarea'
  const textAreaProps = isTextarea ? { multiline: true, rows: 6, maxRows: 12 } : undefined

  return (
    <Controller
      {...field}
      render={({ field: { onChange: defaultOnChange } }) => (
        <>
          <TextField
            ref={ref as RefCallBack | undefined}
            error={field?.error || false}
            helperText={field?.helperText || hint || ''}
            type={showPassword ? 'text' : type}
            onChange={defaultOnChange}
            value={isNil(value) ? '' : value}
            placeholder={label}
            label={label}
            size="small"
            className={cn('!font-golos py-0 px-0', className || 'w-full')}
            disabled={preventDisabled || disabled}
            fullWidth={fullWidth}
            variant="outlined"
            InputProps={{
              className: cn('font-golos rounded-[8px] py-0 text-[16px] font-medium', inputClassName),
              endAdornment:
                type === 'password' ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ) : (
                  endAdornment
                ),
            }}
            {...textFieldProps}
            {...textAreaProps}
          />
        </>
      )}
    />
  )
})

TextFieldContainer.displayName = 'TextFieldContainer'
