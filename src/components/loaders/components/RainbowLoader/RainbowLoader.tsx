import style from './style.module.css'

const entries = [...Array.from({ length: 5 }, (_, i) => i + 1)]

export const RainbowLoader = () => {
  return (
    <div className={style['loader']}>
      <div className={style['loader-inner']}>
        {entries?.map((key) => (
          <div key={key} className={style['loader-line-wrap']}>
            <div className={style['loader-line']}></div>
          </div>
        ))}
      </div>
    </div>
  )
}
