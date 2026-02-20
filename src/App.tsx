import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";


interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;

}


function App() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectCount, setSelectCount] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`
      );
      setArtworks(res.data.data);
      setTotalRecords(res.data.pagination.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };


  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    fetchData(event.page + 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Artwork Table</h2>

      <div style={{ marginBottom: "15px" }}>
        <Button
          label="Select N Rows"
          onClick={() => setDialogVisible(true)}
        />
      </div>

      <p style={{ marginBottom: "10px" }}>
  Selected Rows: {selectedIds.length}
</p>


      <DataTable
          value={artworks}
          lazy
          paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPageChange}
          loading={loading}
          selection={artworks.filter((item) =>
            selectedIds.includes(item.id)
          )}


          onSelectionChange={(e: any) => {
            const currentPageIds = artworks.map((item) => item.id);
            const newSelected = e.value.map((item: Artwork) => item.id);

            const remaining = selectedIds.filter(
              (id) => !currentPageIds.includes(id)
            );

            setSelectedIds([...remaining, ...newSelected]);
          }}
           
      >

        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        />

        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <Dialog
        header="Select Number of Rows"
        visible={dialogVisible}
        style={{ width: "300px" }}
        onHide={() => setDialogVisible(false)}
      >
        <div style={{ marginBottom: "15px" }}>
          <InputNumber
            value={selectCount}
            onValueChange={(e) => setSelectCount(e.value || 0)}
            min={0}
            max={artworks.length}
            placeholder="Enter number"
          />
        </div>

        <Button
          label="Apply"
          onClick={() => {
            const currentPageIds = artworks.map((item) => item.id);

            const firstNIds = artworks
              .slice(0, selectCount)
              .map((item) => item.id);

            const remaining = selectedIds.filter(
              (id) => !currentPageIds.includes(id)
            );

            setSelectedIds([...remaining, ...firstNIds]);
            setDialogVisible(false);
          }}
        />
      </Dialog>
    </div>
  );
}

export default App;
