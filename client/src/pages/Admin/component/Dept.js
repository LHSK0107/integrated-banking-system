import React from "react";
import { useEffect, useState } from "react";
import useAxiosInterceptor from "../../../hooks/useAxiosInterceptor";
import "../admin.css";
import Breadcrumb from "../../../commons/Breadcrumb";
import Aside from "./Aside";
import { useNavigate } from "react-router-dom";

const Dept = () => {
  const navigate = useNavigate();
  const AuthAxios = useAxiosInterceptor();
  // API로 불러올 리스트
  const [deptList, setDeptList] = useState([]);

  // 수정에 대한 변수 저장
  const [changeDept, setChangedDept] = useState({
    deptNo: "",
    dept: "",
  });

  // 추가에 대한 변수 저장
  const [addDept, setAddDept] = useState({
    deptNo: "",
    dept: "",
  }) 

  useEffect(() => {
    const controller = new AbortController();
    const getDept = async () => {
      try {
        const response = await AuthAxios.get(`/api/dept`, {
          signal: controller.signal,
        });
        console.log(response);
        if (response.status === 200) {
          setDeptList(
            response.data.sort((a, b) => {
              if (a.deptNo < b.deptNo) return -1;
              else if (a.deptNo > b.deptNo) return 1;
            })
          );
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    getDept();
    return () => {
      controller.abort();
    };
  }, [AuthAxios]);

  //   const handleInputChange = (e) => {
  //     setChangedDept({[e.target.name]: e.target.value });
  //   };

  // 부서, 부서번호 핸들러
  const handleDeptNoChange = (e, index) => {
    const { value } = e.target;
    setDeptList((prevDeptList) => {
      const updatedDeptList = [...prevDeptList];
      updatedDeptList[index].deptNo = value;
      return updatedDeptList;
    });
  };

  const handleDeptChange = (e, index) => {
    const { value } = e.target;
    setDeptList((prevDeptList) => {
      const updatedDeptList = [...prevDeptList];
      updatedDeptList[index].dept = value;
      return updatedDeptList;
    });
  };

  // 수정하기 버튼 클릭시
  const handleSubmit = (e) => {
    e.preventDefault();

    const updateDept = async () => {
      try {
        const response = await AuthAxios.put(`/api/admin/dept`, changeDept);
        console.log(response);
        if (response.status === 200) {
          alert("수정되었습니다.");
          window.location.reload();
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    if (changeDept.deptNo === "" || changeDept.dept === "")
      alert("입력 값이 비었습니다.");
    else {
      if (window.confirm(`수정하시겠습니까?`)) updateDept();
      else {
        return false;
      }
    }
  };

  // 추가 버튼 클릭시
  const hadleInsert = (e) => {
    e.preventDefault();

    setAddDept({
        deptNo: e.target[0].value,
        dept: e.target[1].value
    })
    const insertDept = async () => {
        try {
          const response = await AuthAxios.post(
            `/api/admin/dept`,
            addDept
          );
          console.log(response);
          if (response.status === 200) {
            alert("추가되었습니다.");
            window.location.reload();
          }
        } catch (err) {
          console.log(`error 발생: ${err}`);
        }
      };
      if (window.confirm(`${e.target[1].value} 부서을/를 추가하시겠습니까?`)) insertDept();
      else return false;
  };

  // 삭제 버튼 클릭시
  const handleDelete = (e) => {
    // console.log(e);
    const deleteDept = async () => {
      try {
        const response = await AuthAxios.delete(
          `/api/admin/dept/${e.deptNo}`
        );
        console.log(response);
        if (response.status === 200) {
          alert("삭제되었습니다.");
          window.location.reload();
        }
      } catch (err) {
        console.log(`error 발생: ${err}`);
      }
    };
    if (window.confirm(`${e.dept}를 삭제하시겠습니까?`)) deleteDept();
    else return false;
  };

  // 전체 부서 그리기
  // 이렇게 그리니까 제대로 input 컨트롤이 안돼
  function DeptItems() {
    return (
      <>
        {deptList &&
          deptList.map((ele, index) => (
            <li key={ele.deptNo}>
              <form onSubmit={handleSubmit}>
                <div className="flex">
                  {/* <input
                    type="text"
                    name="deptNo"
                    //   value={changeDept.deptNo}
                    placeholder={ele?.deptNo}
                    readOnly={ele?.deptNo === "000"}
                    onInput={handleDeptNoChange}
                    //   onChange={handleDeptNoChange}
                  /> */}
                  <input
                    type="text"
                    name="dept"
                    //   value={ele?.dept}
                    // value={changeDept.dept}
                    placeholder={ele?.dept}
                    readOnly={ele?.dept === "부서없음"}
                    onInput={handleDeptChange}
                    //   onChange={handleDeptChange}
                  />
                </div>
                {ele?.deptNo !== "000" && (
                  <div className="btn_wrap">
                    <button type="submit">수정</button>
                    <button type="button" onClick={handleDelete}>
                      삭제
                    </button>
                  </div>
                )}
              </form>
            </li>
          ))}
      </>
    );
  }

  return (
    <>
      <div id="wrap">
        <div className="inner">
          <Breadcrumb title={"관리자 페이지"} subMenu={"부서 관리"} />
          <div className="flex">
            <Aside now={"부서 관리"} />
            <section className="dept">
              <h3>부서 관리</h3>
              <div>
                <ul className="deptList">
                  {deptList &&
                    deptList.map((ele) => (
                      <li key={ele.deptNo}>
                        <form onSubmit={handleSubmit}>
                          <div className="flex align_center">
                            <div className="flex align_center">
                              {/* <input
                                type="text"
                                name="deptNo"
                                placeholder={ele.deptNo}
                                readOnly={ele.deptNo === "000"}
                                onChange={(e) => {
                                    setChangedDept((prev) => ({
                                        ...prev,
                                        deptNo: e.target.value,
                                    }));
                                }}
                                required
                                /> */}
                              <p>{ele?.deptNo}</p>
                              <input
                                type="text"
                                name="dept"
                                placeholder={ele?.dept}
                                readOnly={ele?.dept === "부서없음"}
                                onChange={(e) => {
                                  setChangedDept((prev) => ({
                                    deptNo: ele?.deptNo,
                                    dept: e.target.value,
                                  }));
                                }}
                                required
                              />
                            </div>
                            {ele.deptNo !== "000" && (
                              <div className="btn_wrap flex align_center">
                                <button type="submit">수정</button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(ele)}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </form>
                      </li>
                    ))}
                </ul>
                <div className="addDeptList">
                  <form onSubmit={hadleInsert}>
                    <input type="text" name="deptNo" maxLength={3} minLength={3} placeholder="추가할 부서번호" required></input>
                    <input type="text" name="dept" minLength={1} placeholder="추가할 부서명" required></input>
                    <button type="submit">추가</button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dept;
