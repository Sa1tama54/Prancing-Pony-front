import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllCommunities,
  leaveRequest,
} from "../../../features/communitySlice";
import CreateCommunity from "../CreateCommunity";
import styles from "./AllCommunity.module.css";
import button from "../CategoriesPage/Categories.module.css";
import SortCommunities from "../../SortPrice/SortCommunities";

const AllCommunities = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCommunities());
  }, [dispatch]);

  const [isCreated, setIsCreated] = useState(false);

  const communities = useSelector(
    (state) => state.communityReducer.communities
  );

  //поиск + паганация
  const [value, setValue] = useState("");

  const [visible, setVisible] = useState(7);

  let filteredTasks = communities.filter((task) => {
    return task.name.toLowerCase().includes(value.toLowerCase());
  });

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 7);
  };

  /////////////////////////
  const user = useSelector((state) => state.auth.authUser);
console.log(user._id, 132);
  const findRequest = communities.filter((com) =>
    com.requests.find((requst) => requst._id === user._id)
  );
  console.log(findRequest, 11);

  const findMember = communities.filter((com) =>
    com.members.find((member) => member._id === user._id)
  );

  const requestsHandler = (id) => {
    dispatch(leaveRequest({ id, user, getAllCommunities }));
  };

  const handleTransition = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.content}>
      <h1>Сообщества</h1>
      <div className={styles.search}>
        <input
          placeholder="Поиск сообществ..."
          type="text"
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
      <div className={styles.btns}>
        <button className={styles.addBtn} onClick={() => setIsCreated(true)}>
          Создать
        </button>

        <SortCommunities />
      </div>

      <div className={styles.communities}>
        {isCreated && (
          <CreateCommunity setIsCreated={() => setIsCreated(false)} />
        )}
        {value
          ? filteredTasks.map((elem) => {
              return (
                
                <div key={elem._id} className={styles.community}>
                  <div className={styles.emblem}>
                    <img
                      src={`http://localhost:3042/public/${elem.emblem}`}
                      alt=""
                    />
                  </div>
                  
                  <div className={styles.name}>{elem.name}</div>
                  <div className={styles.members}>
                    Участников: {elem.members.length}
                    
                  </div>
                  <div className={styles.btn}>
                    <div>
                      <Link to={`/communities/${elem._id}`}>Перейти</Link>
                    </div>
                    <div>
                    {user._id !== elem.founder._id && !elem.members.find(el=>el._id.toString()===user._id.toString()) && (
                        <button
                          disabled={findRequest.find(
                            (item) => item._id === elem._id
                          )}
                          onClick={() => requestsHandler(elem._id)}
                        >
                          Вступить{" "}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : communities.slice(0, visible).map((elem) => {
              return (
                <div key={elem._id} className={styles.community}>
                  <div className={styles.emblem}>
                    <img
                      src={`http://localhost:3042/public/${elem.emblem}`}
                      alt=""
                    />
                  </div>
                  <div className={styles.name}>{elem.name}</div>
                  <div className={styles.members}>
                    Участников: {elem.members.length}
                  </div>
                  <div className={styles.btn}>
                    <div>
                      <Link
                        onClick={handleTransition}
                        to={`/communities/${elem._id}`}
                      >
                        Перейти
                      </Link>
                    </div>
                    <div>
                      {user._id !== elem.founder._id && !elem.members.find(el=>el._id.toString()===user._id.toString()) && (
                        <button
                          disabled={findRequest.find(
                            (item) => item._id === elem._id
                          )}
                          onClick={() => requestsHandler(elem._id)}
                        >
                          Вступить{" "}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      <div className={styles.btnWrapper}>
        <button
          className={
            communities.length === communities.slice(0, visible).length ||
            value.length !== 0
              ? button.btnShowMoreOff
              : button.btnShowMore
          }
          onClick={showMoreItems}
        >
          Показать еще
        </button>
      </div>
    </div>
  );
};

export default AllCommunities;
