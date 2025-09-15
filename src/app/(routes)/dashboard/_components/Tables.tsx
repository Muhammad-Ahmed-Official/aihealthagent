import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { sessionDetail } from '../medical-agent/[sessionId]/page'
import { Button } from '@/components/ui/button'
import ViewReportDialog from './ViewReportDialog'
import Time from '@/utils/Time'

type Props = {
  historyList: sessionDetail[]
}

export default function Tables({historyList} : Props) {
  return (
    <div>
        <Table>
            <TableCaption>Previous Consultation Reports</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>AI Medical Specialist</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
              {historyList?.map((record:sessionDetail) => (
                <TableRow>
                  <TableCell className="font-medium">{record?.selectedDocter?.specialist}</TableCell>
                  <TableCell>{record?.notes}</TableCell>
                  <TableCell>{Time(record?.createdOn)}</TableCell>
                  <TableCell className="text-right"> <ViewReportDialog record={record} /> </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
    </div>
  )
}
