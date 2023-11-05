interface getDatesPrams {
  prevDates: JSX.Element[];
  currentDates: JSX.Element[];
  nextDates: JSX.Element[];
}
export function getDates({ prevDates, currentDates, nextDates }: getDatesPrams) {
  const rows = [];
  const mergedDates = [...prevDates, ...currentDates, ...nextDates];

  for (let i = 0; i < mergedDates.length; i += 7) {
    const slice = mergedDates.slice(i, i + 7);

    rows.push(<tr key={i}>{slice}</tr>);
  }
  return rows;
}
