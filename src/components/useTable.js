import React, { useState } from 'react'
import { Table, TableCell, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  table: {
    marginTop: 3,
    // '& .MuiTable-root': {
    '& .MuiTableCell-head': {
      fontWeight: '600',
      color: "primary.dark",
      backgroundColor: '#cfcfff',

    },
    /* All of these work to different degrees */
    // '& tbody td': {
    // '& .MuiTableRow-root': {
    // '& .MuiTableCell-root': {
    '& .MuiTableCell-body': {
      // fontWeight: '300',
      // backgroundColor: "#00ff00"
      // border: '15px'
    },
    '& tbody tr:hover': {
      backgroundColor: '#E9ECF8',
      // cursor: 'pointer'
    }
  }
}
))

export default function useTable(records, headers) {
  const classes = useStyles()
  const pages = [5, 10, 25]
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pages[page])
  const [order, setOrder] = useState()
  const [orderBy, setOrderBy] = useState()

  const TblContainer = props => (
    // FIX:  no funciona style
    <Table className={classes.table}>
      {props.children}
    </Table>
  )

  const TblHead = props => {

    const handleSortRequest = cellID => {
      const isAsc = orderBy === cellID && order === "asc"
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(cellID)
    }

    return (
      <TableHead>
        <TableRow>
          {
            headers.map(headCell => (
              <TableCell
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                sortDirection={orderBy === headCell.id
                  ? order : false}
              >
                {headCell.sortable ?
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id
                      ? order : 'asc'}
                    onClick={() => {
                      handleSortRequest(headCell.id)
                    }}
                  >
                    {headCell.label}
                  </TableSortLabel> : headCell.label}
              </TableCell>
            ))
          }
        </TableRow>
      </TableHead>
    )
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const TblPagination = () => (
    <TablePagination
      component="div"
      page={page}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      count={records.length}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  )

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(records, getComparator(order, orderBy))
      .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  }

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  }
}