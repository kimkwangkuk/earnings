import { useState, useEffect } from 'react';
import styles from './EarningsCalendar.module.css';

export default function EarningsCalendar() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    const koreaDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    return `${koreaDate.getFullYear()}-${String(koreaDate.getMonth() + 1).padStart(2, '0')}-${String(koreaDate.getDate()).padStart(2, '0')}`;
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const koreaDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    return `${String(koreaDate.getMonth() + 1).padStart(2, '0')}.${String(koreaDate.getDate()).padStart(2, '0')}`;
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
      const startKST = new Date(startDate);
      startKST.setHours(0, 0, 0, 0);
      const endKST = new Date(endDate);
      endKST.setHours(23, 59, 59, 999);

      const start = startKST.getTime();
      const end = endKST.getTime();
      
      const response = await fetch(
        `/api/earnings?from=${start}&to=${end}&pageSize=1000&sortBy=marketCap`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('원본 데이터:', data);
      
      const sortedByMarketCap = data.sort((a, b) => b.marketCap - a.marketCap);
      
      const top10ByMarketCap = sortedByMarketCap.slice(0, 10);
      console.log('시가총액 상위 10개:', top10ByMarketCap);
      
      const sortedByTime = [...top10ByMarketCap].sort((a, b) => {
        const dateA = new Date(a.eventAt);
        const dateB = new Date(b.eventAt);
        return dateA.getTime() - dateB.getTime();
      });
      console.log('시간순 정렬:', sortedByTime);
      
      setEarnings(sortedByTime);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h1 className={styles.titleContainer}>미국 주식</h1>
          <h2 className={styles.titleContainer}>실적 발표 일정</h2>
        </div>

        <div className={styles.datePickerContainer}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onClick={(e) => e.target.showPicker()}
            className={styles.dateInput}
          />
          <span className={styles.dateSeparator}>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onClick={(e) => e.target.showPicker()}
            className={styles.dateInput}
          />
          <button 
            onClick={fetchEarnings}
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? '로딩중...' : '조회하기'}
          </button>
        </div>
      </div>

      {earnings.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>요일</th>
                <th className={styles.tableHeader}>날짜</th>
                <th className={styles.tableHeader}>시간</th>
                <th className={styles.tableHeader}>종목</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((earning) => {
                const date = new Date(earning.eventAt);
                const koreanWeekdays = ['일', '월', '화', '수', '목', '금', '토'];
                
                return (
                  <tr key={earning.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{koreanWeekdays[date.getDay()]}</td>
                    <td className={styles.tableCell}>
                      {`${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`}
                    </td>
                    <td className={styles.tableCell}>
                      {date.toLocaleTimeString('ko-KR', {
                        timeZone: 'Asia/Seoul',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }).replace(/\s/g, '')}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.tickerContainer}>
                        {earning.tickerIconUrl && (
                          <img 
                            src={earning.tickerIconUrl} 
                            alt={`${earning.ticker} logo`}
                            className={styles.tickerIcon}
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
      )}
    </div>
  );
} 