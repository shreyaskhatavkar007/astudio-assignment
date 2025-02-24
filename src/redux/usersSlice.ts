import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  gender: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  filterField: "name" | "email" | "birthDate" | "gender" | null;
  filterValue: string;
}

const initialState: UsersState = {
  users: [],
  loading: true,
  error: null,
  page: 1,
  limit: 5,
  total: 0,
  filterField: null,
  filterValue: "",
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({
    page,
    limit,
    filterField,
    filterValue,
  }: {
    page: number;
    limit: number;
    filterField?: UsersState["filterField"];
    filterValue?: string;
  }) => {
    let url = `/users?limit=${limit}&skip=${(page - 1) * limit}`;
    if (
      (filterField === "gender" || filterField === "birthDate") &&
      filterValue
    ) {
      url = `/users/filter?key=${filterField}&value=${
        filterField === "birthDate"
          ? filterValue
              .split("-")
              .map((date) => parseInt(date))
              .join("-")
          : filterValue
      }&limit=${limit}&skip=${(page - 1) * limit}`;
    } else if (filterField && filterValue) {
      url = `/users/search?q=${filterValue}&limit=${limit}&skip=${(page - 1) * limit}`;
    }
    const response = await api.get(url);
    return { users: response.data.users, total: response.data.total };
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setFilter: (
      state,
      action: PayloadAction<{
        field: "name" | "email" | "birthDate" | "gender" | null;
        value: string;
      }>,
    ) => {
      state.filterField = action.payload.field;
      state.filterValue = action.payload.value;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.filterField = null;
      state.filterValue = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { setPage, setLimit, setFilter, resetFilters } =
  usersSlice.actions;
export default usersSlice.reducer;
