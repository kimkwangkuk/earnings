import { useState, useEffect } from 'react';

export default function EarningsCalendar() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .split('T')[0];
  };

  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(tomorrow));
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

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
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1d1d1f] mb-2">미국 주식</h1>
          <h2 className="text-4xl font-extrabold text-[#1d1d1f]">실적 발표 일정</h2>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onClick={(e) => e.target.showPicker()}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm cursor-pointer w-[140px] [&::-webkit-datetime-edit-year-field]:hidden [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <span className="text-gray-500">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onClick={(e) => e.target.showPicker()}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm cursor-pointer w-[140px] [&::-webkit-datetime-edit-year-field]:hidden [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <button
            onClick={fetchEarnings}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? '로딩중...' : '조회하기'}
          </button>
        </div>
      </div>

      {earnings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg bg-opacity-50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white w-20">요일</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white w-32">날짜</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white w-32">시간</th>
                  <th className="px-8 py-5 text-left text-sm font-medium text-[#1d1d1f] bg-white">종목</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {earnings.map((earning) => {
                  const date = new Date(earning.eventAt);
                  const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];
                  
                  return (
                    <tr key={earning.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5 text-sm text-[#1d1d1f] whitespace-nowrap">
                        {koreanWeekdays[date.getDay()]}
                      </td>
                      <td className="px-8 py-5 text-sm text-[#1d1d1f] whitespace-nowrap">
                        {`${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`}
                      </td>
                      <td className="px-8 py-5 text-sm text-[#1d1d1f] whitespace-nowrap">
                        {date.toLocaleTimeString('ko-KR', {
                          timeZone: 'Asia/Seoul',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }).replace(/\s/g, '')}
                      </td>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 