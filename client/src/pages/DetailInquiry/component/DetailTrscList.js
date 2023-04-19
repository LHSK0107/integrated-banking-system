import React,{useState} from "react";
import "../index.css";
import Balance from "../../../hooks/useBalance";

const DetailTrscList = ({ recData, status }) => {
  return <>{status === "success" ? <List recData={recData} /> : <h1>조회할 데이터가 없습니다.</h1>}</>;
};
const List = (props) => {
  const arr = props.recData.RESP_DATA.REC;
  const [inputTest, setInputTest] = useState("");
  const onChange = (e)=> setInputTest(e.target.value);

  return (
    <>
    <input value={inputTest} onChange={onChange} />
      {
        arr.filter((val)=>{
          if(inputTest===""){
            return val;
          }
          else if(val.INOUT_DV===inputTest){
            return val;
          }
        }).map((ele,i)=>{
          return(
            <li key={i} className="flex justify_between">
              <div className="idx">{i<10 ? i===9 ? <p>{i+1}</p>:<p>{`0${i+1}`}</p> : <p>{i+1}</p>}</div>
              <div className="inout_dv">{ele?.INOUT_DV === "1" ? <p>입금</p> : <p>출금</p> }</div>
              <div className="trsc_tm">{ele?.TRSC_DT}</div>
              <div className="desc">{ele?.RMRK1}</div>
              <div className="trsc_amt">
                <Balance balance={ele?.TRSC_AMT}/>
              </div>
              <div className="bal">
                <Balance balance={ele?.BAL}/>
              </div>
            </li>
          )
        })
      }
    </>
  );
};

export default DetailTrscList;
