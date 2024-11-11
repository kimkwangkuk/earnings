import { useState } from 'react';

export default function EarningsCalendar() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEarnings = async () => {
    if (!startDate || !endDate) {
      alert('시작일과 종료일을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      
      console.log('Fetching:', `/api/earnings?from=${start}&to=${end}&pageSize=5000`);
      
      const response = await fetch(
        `/api/earnings?from=${start}&to=${end}&pageSize=5000`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      setEarnings(data);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      alert('데이터를 불러오는데 실패했습니다. 콘솔을 확인해주세요.');
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">실적 발표 일정</h1>
      
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block mb-2">시작일:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">종료일:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={fetchEarnings}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
        >
          {isLoading ? '로딩중...' : '검색'}
        </button>
      </div>

      {earnings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">티커</th>
                <th className="px-4 py-2">회사명</th>
                <th className="px-4 py-2">발표일시</th>
                <th className="px-4 py-2">EPS</th>
                <th className="px-4 py-2">예상 EPS</th>
                <th className="px-4 py-2">매출액</th>
                <th className="px-4 py-2">예상 매출액</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((earning) => (
                <tr key={earning.id} className="border-b">
                  <td className="px-4 py-2">{earning.ticker}</td>
                  <td className="px-4 py-2">{earning.companyName}</td>
                  <td className="px-4 py-2">
                    {new Date(earning.eventAt).toISOString().split('T')[0]}
                  </td>
                  <td className="px-4 py-2">${earning.eps}</td>
                  <td className="px-4 py-2">${earning.epsEst}</td>
                  <td className="px-4 py-2">
                    ${(earning.revenue / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-4 py-2">
                    ${(earning.revenueEst / 1000000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 