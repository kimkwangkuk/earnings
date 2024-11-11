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
    <div className="container mx-auto p-8 max-w-7xl">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900">실적 발표 일정</h1>
      
      <div className="flex gap-6 mb-8">
        <div>
          <label className="block mb-2 text-sm text-gray-600">시작일:</label>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-600">종료일:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <button
          onClick={fetchEarnings}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mt-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? '로딩중...' : '검색'}
        </button>
      </div>

      {earnings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">티커</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">회사명</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">발표일시</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">EPS</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">예상 EPS</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">매출액</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">예상 매출액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{earning.ticker}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{earning.companyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(earning.eventAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">${earning.eps}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${earning.epsEst}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${(earning.revenue / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${(earning.revenueEst / 1000000).toFixed(2)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 