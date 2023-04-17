import React from 'react'
import KakaoIcon from "../../../assets/images/icon/bank/kakao_icon.png";
import Balance from '../../../hooks/Balance';

const AccountCard = (props) =>{

    return(
      <div className="account_card flex flex_column">
        <div className="account_card_header flex align_center">
          <figure>
            <img src={KakaoIcon} alt="bank icon" />
          </figure>
          <h3>{props.realAcctNo}</h3>
        </div>
        <div className="account_card_body">
          <ul>
            <li className="flex justify_between">
              <div className="account_detail_key">계좌명:</div>
              <div className="account_detail_value">{props.title}</div>
            </li>
            <li className="flex justify_between">
              <div className="account_detail_key">잔액:</div>
              <div className="account_detail_value">
                <Balance balance={props.bal}/>
              </div>
            </li>
            <li className="flex justify_between">
              <div className="account_detail_key">만기일자:</div>
              <div className="account_detail_value">{props.exptDate==="" ? <p>값이 없습니다.</p> : props.exptDate}</div>
            </li>
          </ul>
        </div>
      </div>
    )
  }

export default AccountCard;