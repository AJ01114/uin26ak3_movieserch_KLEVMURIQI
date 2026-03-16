export default function SearchForm({ value, onChange }) {
  return (
    <form onSubmit={(event) => event.preventDefault()} aria-label="Søkefelt for filmer">
      <label className="searchLabel">
        <span className="visuallyHidden">Søk etter film</span>
        <input autoComplete="off" className="searchInput" name="search" placeholder="Søk etter film" value={value} onChange={(event) => onChange(event.target.value)}/>
      </label>
    </form>
  )
}
