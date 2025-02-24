import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
}

interface ProductsState {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  error: string | null;
  filterField: "title" | "brand" | "category" | null;
  filterValue: string;
}

const initialState: ProductsState = {
  products: [],
  loading: true,
  error: null,
  page: 1,
  limit: 5,
  total: 0,
  filterField: null,
  filterValue: "",
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    page,
    limit,
    filterField,
    filterValue,
  }: {
    page: number;
    limit: number;
    filterField?: ProductsState["filterField"];
    filterValue?: string;
  }) => {
    let url = `/products?limit=${limit}&skip=${(page - 1) * limit}`;
    if (filterField === "title" && filterValue) {
      url = `/products/search?q=${filterValue}&limit=${limit}&skip=${(page - 1) * limit}`;
    }
    const response = await api.get(url);
    return {
      products:
        filterField && filterField !== "title" && filterValue
          ? response.data.products?.filter((product: Product) =>
              product[filterField]
                ?.toLowerCase()
                .includes(filterValue?.toLowerCase()),
            )
          : response.data.products,
      total: response.data.total,
    };
  },
);

const productsSlice = createSlice({
  name: "products",
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
        field: "title" | "brand" | "category" | null;
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const { setPage, setLimit, setFilter, resetFilters } =
  productsSlice.actions;
export default productsSlice.reducer;
