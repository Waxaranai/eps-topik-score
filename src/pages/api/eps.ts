import { load } from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next'

const fetchEps = async (epsNo: string): Promise<any> => {
    const searchParams = new URLSearchParams({
        langType: "in",
        sKorTestNo: epsNo,
        srchFlag: "Y",
        natNm: ""
    })
    const response = await fetch("https://www.eps.go.kr/eo/VisaFndR.eo?" + searchParams, { method: "POST", cache: "no-cache" });
    const text = await response.text();
    const $ = load(text);
    const table = $("table.tbl_typeA");
    const tbody = table.find("tbody.center > tr");
    const data = {
        first: tbody.next().find("td").map((_, td) => $(td).text().trim())
            .toArray(),
        last: tbody.last().find("td").map((_, td) => $(td).text().trim())
            .toArray()
    };
    if (data.first.length < 3) return { epsTopikNo: epsNo, error: "No data found" };
    const [, nationality, sector, examDate, , name] = data.first;
    const [listening, reading, total] = data.last;
    const result = {
        epsTopikNo: epsNo,
        nationality,
        sector,
        examDate,
        name,
        point: {
            total: Number(total),
            reading: Number(reading),
            listening: Number(listening)
        }
    };
    return result;
}
type ResponseData = {
    message: string
}

export default async function GET(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const epsNo = req.query.epsNo as string;
    if (!epsNo) return res.status(404).json({ message: "No eps topik number provided!" });
    const data = await fetchEps(epsNo);
    res.status(200).json({ message: data });
}