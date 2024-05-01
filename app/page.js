'use client'

import { useState, useEffect } from 'react';
import accountData from './data';

export default function Home() {
  // 선택된 은행, 계좌 번호, 매칭된 계좌, 제출된 계좌 번호에 대한 상태 변수들
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [matchedAccount, setMatchedAccount] = useState(null);
  const [submittedAccountNumber, setSubmittedAccountNumber] = useState('');
  const [submittedBank, setSubmittedBank] = useState('');

  // 폼 제출을 처리하는 함수
  const handleSubmit = () => {
    // 선택된 은행과 계좌 번호 패턴에 맞는 계좌를 찾음
    const matched = accountData.find(item => {
      const pattern = new RegExp(item.accountNumber.replace(/#/g, '\\d'), 'g');
      return item.bank === selectedBank && pattern.test(accountNumber);
    });
    // 매칭된 계좌를 설정하거나 일치하는 계좌가 없으면 null을 설정
    setMatchedAccount(matched || null);
    // 제출된 계좌 번호를 설정
    setSubmittedAccountNumber(accountNumber);
    // 제출된 은행을 설정
    setSubmittedBank(selectedBank);
    // 텍스트박스 초기화
    setAccountNumber('');
  };

  // 선택된 은행의 계좌 정보를 가져오는 함수
  const getSelectedBankInfo = () => {
    return accountData.filter(item => item.bank === selectedBank);
  };

  // 은행 선택이 변경될 때 텍스트박스 초기화
  useEffect(() => {
    setAccountNumber('');
  }, [selectedBank]);

  return (
    <div>
      <div>
        <p>개요</p>
        <p>
          이 사이트는 금융 거래 시에 안전성을 높이기 위한 정보를 제공합니다.<br/>
          주로 개인 간의 금융 거래에 이용되는 일반계좌가 아닌, 적금이나 모임 계좌와 같이 비교적 개설 및 해지가 쉬운 계좌를 악용하는 범죄를 방지하기 위해 개발되었습니다.
        </p>
        <p>
          사이트를 이용하는 사용자들은 각 금융사에서 제공하는 정보를 확인하여, 자신이 거래하려는 계좌가 안전한지를 판단할 수 있습니다.<br/>
          그러나 이 사이트는 단순히 참고용으로만 사용되어야 합니다.<br/>
          실제 거래 시에는 반드시 여러 가지 안전성 확보 수단을 병행하여 사용해야 합니다.
        </p>
        <p>
          사이트를 통해 제공되는 정보를 활용하면서도, 추가적인 주의와 안전성을 고려하여 금융 거래를 진행하는 것이 중요합니다.
        </p>
      </div>
      <hr/>
      <div>
        {/* 선택된 은행을 표시 */}
        <p>현재 선택 은행 :&nbsp;{selectedBank}</p>
        <p>&lt;위험 계좌번호 형식&gt;</p>
        <div className="list-container">
          <ul className="list">
            {/* 선택된 은행의 계좌 정보를 리스트로 표시 */}
            {getSelectedBankInfo().map((item, index) => (
              <li key={index}>
                {item.accountNumber} - {item.feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <br/>

      {/* 은행 선택하는 드롭다운 */}
      <label>
        은행 선택 :&nbsp;
        <select className="dropdown" value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
          <option value="없음">은행을 선택하세요</option>
          {/* 계좌 데이터에서 중복되지 않는 은행 목록을 가져와서 옵션으로 표시 */}
          {Array.from(new Set(accountData.map(item => item.bank))).map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </label>
      <br/>
      <br/>
      {/* 계좌 번호 입력하는 인풋 */}
      <label>
        계좌번호 입력 :&nbsp;
        <input className="input-box" type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
      </label>
      {/* 제출 버튼 */}
      <button className="button" onClick={handleSubmit}>제출</button>
      {/* 매칭된 계좌가 있으면 해당 정보 표시 */}
      {matchedAccount ? (
        <div>
          <p>입력한 은행 :&nbsp;{matchedAccount.bank}</p>
          <p>입력한 계좌번호 :&nbsp;{submittedAccountNumber}</p>
          <p>특징 :&nbsp;{matchedAccount.feature}</p>
          <p className="danger">⚠해당 계좌번호는 적금 또는 모임 계좌로 확인됩니다. 주의가 필요합니다.⚠<br/>
            단, 해당 결과는 참고용으로 실제 이용시 각별한 주의가 필요합니다.
          </p>
        </div>
      ) : matchedAccount === null ? (
        // 일치하는 계좌가 없으면 일반 계좌로 표시
        <div>
          <p>입력한 은행: {submittedBank}</p>
          <p>입력한 계좌번호: {submittedAccountNumber}</p>
          <p className="safe">
            ✔️해당 계좌번호는 일반 계좌로 확인됩니다.✔️<br/>
            단, 해당 결과는 참고용으로 실제 이용시 각별한 주의가 필요합니다.
          </p>
        </div>
      ) : null}
    </div>
  );
}
