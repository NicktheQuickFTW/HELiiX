"use client";

import { Table as OnceUITable } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface TableProps extends React.ComponentProps<typeof OnceUITable> {}

const Table = forwardRef<
  React.ElementRef<typeof OnceUITable>,
  TableProps
>(({ children, ...props }, ref) => {
  return (
    <OnceUITable ref={ref} {...props}>
      {children}
    </OnceUITable>
  );
});

Table.displayName = "Table";

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, ...props }, ref) => {
  return (
    <thead ref={ref} {...props}>
      {children}
    </thead>
  );
});

TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, ...props }, ref) => {
  return (
    <tbody ref={ref} {...props}>
      {children}
    </tbody>
  );
});

TableBody.displayName = "TableBody";

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, ...props }, ref) => {
  return (
    <tfoot ref={ref} {...props}>
      {children}
    </tfoot>
  );
});

TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ children, ...props }, ref) => {
  return (
    <tr ref={ref} {...props}>
      {children}
    </tr>
  );
});

TableRow.displayName = "TableRow";

const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ children, ...props }, ref) => {
  return (
    <th ref={ref} {...props}>
      {children}
    </th>
  );
});

TableHead.displayName = "TableHead";

const TableCell = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ children, ...props }, ref) => {
  return (
    <td ref={ref} {...props}>
      {children}
    </td>
  );
});

TableCell.displayName = "TableCell";

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ children, ...props }, ref) => {
  return (
    <caption ref={ref} {...props}>
      {children}
    </caption>
  );
});

TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};