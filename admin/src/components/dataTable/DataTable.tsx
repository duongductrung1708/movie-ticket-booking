import { DataGrid, GridColDef, GridToolbar, GridToolbarQuickFilter } from "@mui/x-data-grid";
import "./dataTable.scss";
import { useState } from "react";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  pageSize: number;
  rowCount: number;
  currentPage: number;
  onAction: (actionType: string, id: string) => void;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
};

const DataTable = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");

  const handleDelete = (id: string) => {
    props.onAction("delete", id);
  };

  const handleView = (id: string) => {
    props.onAction("view", id);
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    sortable: false,
    renderCell: (params) => (
      <div>
        <img
          className="action"
          onClick={() => handleView(params.row._id)}
          src="/view.svg"
          alt="View"
        />
        <img
          className="action"
          onClick={() => handleDelete(params.row._id)}
          src="/delete.svg"
          alt="Delete"
        />
      </div>
    ),
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      props.onSearch(searchValue);
    }
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        getRowId={(row) => row._id}
        pagination
        paginationMode="server"
        rowCount={props.rowCount}
        paginationModel={{
          page: props.currentPage - 1,
          pageSize: props.pageSize,
        }}
        onPaginationModelChange={(model) => {
          props.onPageChange(model.page + 1);
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            children: (
              <GridToolbarQuickFilter
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            ),
          },
        }}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
