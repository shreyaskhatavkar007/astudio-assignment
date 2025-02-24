"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  setPage,
  setLimit,
  setFilter,
  resetFilters,
} from "@/redux/usersSlice";
import { RootState, AppDispatch } from "@/lib/store";
import { debounce } from "lodash";
import SearchBox from "@/components/SearchBox";
import FilterDropdown from "@/components/FilterDropDown";
import PageSizeSelector from "@/components/PageSizeSelector";
import Pagination from "@/components/Pagination";
import DataTable from "@/components/DataTable";
import Breadcrumb from "@/components/BreadCrumb";

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    loading,
    error,
    page,
    limit,
    total,
    filterField,
    filterValue,
  } = useSelector((state: RootState) => state.users);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "name" | "email" | "birthDate" | "gender" | ""
  >("");
  const [filterInput, setFilterInput] = useState("");

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, filterField, filterValue }));
  }, [dispatch, page, limit, filterField, filterValue]);

  const totalPages = Math.ceil(total / limit);

  const tableColumns = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "maidenName", label: "Maiden Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "email", label: "Email" },
    { key: "username", label: "Username" },
    { key: "bloodGroup", label: "BloodGroup" },
    { key: "eyeColor", label: "EyeColor" },
    { key: "birthDate", label: "Birth Date" },
    { key: "university", label: "University" },
    { key: "phone", label: "Phone" },
  ];

  const filterColumns = [
    { key: "firstName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "birthDate", label: "Birth Date" },
    { key: "gender", label: "Gender" },
  ];

  const debouncedApplyFilter = useCallback(
    debounce(
      (field: "name" | "email" | "birthDate" | "gender", value: string) => {
        dispatch(setPage(1));
        dispatch(setFilter({ field, value }));
      },
      500,
    ),
    [],
  );

  const handleFilterChange = (
    field: "name" | "email" | "birthDate" | "gender" | "",
  ) => {
    if (field === selectedFilter) {
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

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    return users.filter((user) =>
      tableColumns.some((val) =>
        user[val?.key as keyof typeof user]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    );
  }, [users, searchQuery]);

  return (
    <div className="min-h-screen p-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Users" }]} />

      <div className="mt-8 mb-8 flex items-center gap-6 h-10">
        <PageSizeSelector
          value={limit}
          onChange={(size) => dispatch(setLimit(size))}
        />
        {/* Search Box */}
        <div className="border-l-2 h-8 border-grey" />
        <SearchBox value={searchQuery} onChange={setSearchQuery} />
        <div className="border-l-2 h-8 border-grey" />

        {/* Filters */}
        <div className="flex gap-4">
          {filterColumns?.map((filter) => (
            <FilterDropdown
              key={filter.key}
              label={filter.label}
              isActive={selectedFilter === filter.key}
              value={selectedFilter === filter.key ? filterInput : ""}
              onSelect={() => handleFilterChange(filter.key as any)}
              onChange={(value) => handleInputChange(value)}
              type={filter.key === "birthDate" ? "date" : "text"}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <DataTable
        data={filteredUsers}
        columns={tableColumns}
        loading={loading}
      />

      {/* Pagination */}
      {!searchQuery && (
        <Pagination
          page={page}
          loading={loading}
          totalPages={totalPages}
          onPageChange={(newPage) => dispatch(setPage(newPage))}
        />
      )}
    </div>
  );
}
