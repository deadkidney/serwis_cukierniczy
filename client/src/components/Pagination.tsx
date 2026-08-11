
export default function Pagination({
    page,
    limit,
    count,
    setPage
} : {
    page: number,
    limit: number,
    count: number,
    setPage: (value: number | ((prevState: number) => number)) => void
}) {
	return (
       	<div>
			<div>
                <button onClick={() => {setPage(0)}}>beginning</button>
				<button onClick={() => setPage((old) => Math.max(old - 1, 0))} disabled={page === 0}>
					Previous Page
				</button>
                <p>Page {page + 1} of {Math.ceil(count/limit)}</p>
				<button
					onClick={() => setPage((old) => old + 1)}
					disabled={limit*(page+1) >= count}>
					Next Page
				</button>
			</div>
        </div>
    )
}
