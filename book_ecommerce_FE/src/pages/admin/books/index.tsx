import { useEffect, useState } from "react";
import { columns } from "./columns";
import type { Payment } from "./columns";
import { DataTable } from "./data-table";

function DemoPage() {
  const [data, setData] = useState<Payment[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Simulate fetch from API
      const result: Payment[] = [
        {
          id: "728ed52f",
          amount: 100,
          status: "pending",
          email: "m@example.com",
        },
      ];
      setData(result);
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default DemoPage;
