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
    <div className="container mx-auto px-4 py-12 max-w-6xl bg-[#f5f5f7]">
      <h1 className="text-4xl font-bold mb-12 text-[#1d1d1f] text-center">실적 발표 일정</h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center items-end">
        <div>
          <label className="block mb-2 text-sm font-medium text-[#1d1d1f]">시작일:</label>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border-0 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#0066cc] focus:outline-none transition-all"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-[#1d1d1f]">종료일:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border-0 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#0066cc] focus:outline-none transition-all"
          />
        </div>

        <button
          onClick={fetchEarnings}
          disabled={isLoading}
          className="bg-[#0066cc] hover:bg-[#0077ed] text-white px-8 py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm"
        >
          {isLoading ? '로딩중...' : '검색'}
        </button>
      </div>

      {earnings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg bg-opacity-50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">티커</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">회사명</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">발표일시</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">EPS</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">예상 EPS</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">매출액</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">예상 매출액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {earnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 text-sm text-[#1d1d1f]">
                      <div className="flex items-center gap-2">
                        {earning.tickerIconUrl && (
                          <img 
                            src={earning.tickerIconUrl} 
                            alt={`${earning.ticker} logo`}
                            className="w-6 h-6 rounded-full object-contain"
                          />
                        )}
                        {earning.ticker}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-[#1d1d1f]">{earning.companyName}</td>
                    <td className="px-8 py-5 text-sm text-[#1d1d1f]">
                      {new Date(earning.eventAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-8 py-5 text-sm text-[#1d1d1f]">${earning.eps}</td>
                    <td className="px-8 py-5 text-sm text-[#1d1d1f]">${earning.epsEst}</td>
                    <td className="px-8 py-5 text-sm text-[#1d1d1f]">
                      ${(earning.revenue / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-8 py-5 text-sm text-[#1d1d1f]">
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