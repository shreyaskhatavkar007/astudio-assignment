"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { debounce } from "lodash";
import {
  fetchProducts,
  setPage,
  setLimit,
  setFilter,
  resetFilters,
} from "@/redux/productsSlice";
import SearchBox from "@/components/SearchBox";
import FilterDropdown from "@/components/FilterDropDown";
import PageSizeSelector from "@/components/PageSizeSelector";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import Breadcrumb from "@/components/BreadCrumb";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    loading,
    error,
    page,
    limit,
    total,
    filterField,
    filterValue,
  } = useSelector((state: RootState) => state.products);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "title" | "brand" | "category" | ""
  >("");
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, filterField, filterValue }));
  }, [dispatch, page, limit, filterField, filterValue]);

  const totalPages = Math.ceil(total / limit);

  const tableColumns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "brand", label: "Brand" },
    { key: "returnPolicy", label: "ReturnPolicy" },
    { key: "rating", label: "Rating" },
    { key: "sku", label: "Sku" },
    { key: "shippingInformation", label: "ShippingInformation" },
    { key: "stock", label: "stock" },
    { key: "warrantyInformation", label: "WarrantyInformation" },
    { key: "minimumOrderQuantity", label: "MinimumOrder" },
    { key: "availabilityStatus", label: "Availability" },
  ];

  const debouncedApplyFilter = useCallback(
    debounce((field: "title" | "brand" | "category", value: string) => {
      dispatch(setPage(1));
      dispatch(setFilter({ field, value }));
    }, 500),
    [],
  );

  const handleFilterChange = (field: "title" | "brand" | "category") => {
    if (selectedFilter === field) {
      setSelectedFilter("");
      setFilterInput("");
      dispatch(resetFilters());
      return;
    }
    setSelectedFilter(field);
    setFilterInput("");
    dispatch(resetFilters());
  };

  const handleInputChange = (value: string) => {
    setFilterInput(value);
    if (selectedFilter) {
      debouncedApplyFilter(selectedFilter, value);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((product) =>
      tableColumns.some((val) =>
        product[val?.key as keyof typeof product]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen p-6">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Products" }]}
      />

      <div className="mt-8 mb-8 flex items-center gap-6 h-10">
        <PageSizeSelector
          value={limit}
          onChange={(size) => dispatch(setLimit(size))}
        />
        <div className="border-l-2 h-8 border-grey" />
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        <div className="border-l-2 h-8 border-grey" />

        <div className="flex gap-4">
          {["title", "category", "brand"].map((filter) => (
            <FilterDropdown
              key={filter}
              label={filter.charAt(0).toUpperCase() + filter.slice(1)}
              isActive={selectedFilter === filter}
              value={selectedFilter === filter ? filterInput : ""}
              onSelect={() => handleFilterChange(filter as any)}
              onChange={(value) => handleInputChange(value)}
              type="text"
            />
          ))}
        </div>
      </div>

      {error && <p className="text-red">{error}</p>}

      <DataTable
        data={filteredProducts}
        columns={tableColumns}
        loading={loading}
      />

      <Pagination
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
      />
    </div>
  );
}
