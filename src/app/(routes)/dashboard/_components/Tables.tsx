import React, { Dispatch, SetStateAction } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { sessionDetail } from '../medical-agent/[sessionId]/page'
import ViewReportDialog from './ViewReportDialog'
import Time from '@/utils/Time'
import { Download, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { asyncHandlerFront } from '@/utils/FrontAsyncHandler'
import { apiClient } from '@/lib/api-client'
import { downloadReport } from '@/utils/downloadReport'

type Props = {
  historyList: sessionDetail[],
  setHistoryList: Dispatch<SetStateAction<sessionDetail[]>>
}

const deleteReport = async(sessionId:string, setHistoryList: Dispatch<SetStateAction<sessionDetail[]>>) => {
  await asyncHandlerFront(
    async() => {
      await apiClient.deleteMedicalReport(sessionId);
      setHistoryList((prev) => prev.filter(item => item?.sessionId !== sessionId))
    }
  )
}

export default function Tables({historyList, setHistoryList} : Props) {
  return (
    <div>
      <Table className="w-full text-sm border border-gray-200 shadow-sm rounded-lg">
        <TableCaption className="text-md md:text-lg font-semibold text-gray-700 mb-4">
          Previous Consultation Reports
        </TableCaption>

        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-semibold text-gray-700">AI Medical Specialist</TableHead>
            <TableHead className="font-semibold text-gray-700">Description</TableHead>
            <TableHead className="font-semibold text-gray-700">Date</TableHead>
            <TableHead className="text-right font-semibold text-gray-700 pe-20">Report</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {historyList?.map((record: sessionDetail) => (
            <TableRow
              key={record?.id}
              className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium text-gray-800">
                {record?.selectedDocter?.specialist}
              </TableCell>
              <TableCell className="text-gray-600 max-w-[250px] truncate">
                {record?.notes}
              </TableCell>
              <TableCell className="text-gray-600">
                {Time(record?.createdOn)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <ViewReportDialog record={record} />
                  <Button
                    onClick={() => deleteReport(record?.sessionId, setHistoryList)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={() => downloadReport(record)}
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
