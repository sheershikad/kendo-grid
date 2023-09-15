import * as React from "react";
import { process } from "@progress/kendo-data-query";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { loadMessages, IntlService } from "@progress/kendo-react-intl";

import orders from "../orders.json";
import esMessages from "../es.json";
loadMessages(esMessages, "es-ES");
const DATE_FORMAT = "yyyy-mm-dd hh:mm:ss.SSS";
const intl = new IntlService("en");
orders.forEach((o) => {
  o.orderDate = intl.parseDate(
    o.orderDate ? o.orderDate : "20/20/2020",
    DATE_FORMAT
  );
  o.shippedDate = intl.parseDate(
    o.shippedDate ? o.shippedDate.toString() : "20/20/2020",
    DATE_FORMAT
  );
});
const DetailComponent = (props) => {
  const dataItem = props.dataItem;
  return (
    <div>
      <section
        style={{
          width: "200px",
          float: "left",
        }}
      >
        <p>
          <strong>Street:</strong> {dataItem.shipAddress.street}
        </p>
        <p>
          <strong>City:</strong> {dataItem.shipAddress.city}
        </p>
        <p>
          <strong>Country:</strong> {dataItem.shipAddress.country}
        </p>
        <p>
          <strong>Postal Code:</strong> {dataItem.shipAddress.postalCode}
        </p>
      </section>
      <Grid
        style={{
          width: "500px",
        }}
        data={dataItem.details}
      />
    </div>
  );
};
const Kendogrid = () => {
  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: 20,
    
  });
  const [dataResult, setDataResult] = React.useState(
    process(orders, dataState)
  );
  const dataStateChange = (event) => {
    setDataResult(process(orders, event.dataState));
    setDataState(event.dataState);
  };
  const expandChange = (event) => {
    const isExpanded =
      event.dataItem.expanded === undefined
        ? event.dataItem.aggregates
        : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setDataResult({
      ...dataResult,
      data: [...dataResult.data],
    });
  };

  return (
    <div>
      <Grid
        sortable={true}
        filterable={true}
        groupable={true}
        reorderable={true}
        pageable={{
          buttonCount: 7,
          pageSizes: true,
        }}
        data={dataResult}
        {...dataState}
        onDataStateChange={dataStateChange}
        detail={DetailComponent}
        expandField="expanded"
        onExpandChange={expandChange}
      >
        <GridColumn field="customerID" width="200px"/>
        <GridColumn
          field="orderDate"
          filter="date"
          format="{0:D}"
          width="300px"
        />
        <GridColumn field="shipName" width="280px" />
        <GridColumn field="freight" filter="numeric" width="200px" />
        <GridColumn
          field="shippedDate"
          filter="date"
          format="{0:D}"
          width="300px"
        />
        <GridColumn field="employeeID" filter="numeric" width="200px" />
        <GridColumn
         
          field="orderID"
          filterable={false}
          title="ID"
          width="90px"
        />
      </Grid>
    </div>
  );
};

export default Kendogrid;
