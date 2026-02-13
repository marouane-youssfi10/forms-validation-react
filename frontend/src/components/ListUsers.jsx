import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/useAxios";
import {
    FETCH_USERS_FAILURE,
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
} from "../store/actions";

const ListUsers = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);

    const fetchUsers = async () => {
        dispatch({ type: FETCH_USERS_REQUEST });
        try {
            const response = await api.get("/api/users/");
            dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data });
        } catch (err) {
            console.log(err.detail);
            dispatch({
                type: FETCH_USERS_FAILURE,
                payload: "Failed to fetch users",
            });
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="users">
            {users.length > 0
                ? users.map((user) => (
                      <div className="user-card" key={user.id}>
                          <img src={user.image} alt="User Image" />
                          <div className="user-info">
                              <h3>{user.first_name}</h3>
                              <p>{user.email}</p>
                          </div>
                      </div>
                  ))
                : "Not Found"}
        </div>
    );
};

export default ListUsers;
