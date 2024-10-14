'use client';

import LogoCloud from '@/components/ui/LogoCloud';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function CPUTable() {
  const supabaseUrl = "https://ogsbootxscuhnzosbkuy.supabase.co";
  const supabaseAnonKey = "YOUR_ANON_KEY"; // Use your actual anon key

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  type TableRow = {
    id: number; // Add id to match your table schema
    name: string;
    price: string;
    core_count: string;
    core_clock: string;
    boost_clock: string;
    microarchitecture: string;
    tdp: string;
    graphics: string;
  };

  interface PageClickEvent {
    selected: number;
  }

  const [data, setData] = useState<TableRow[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 100; // Define how many rows per page

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    // Fetch total row count to calculate total pages
    const { count, error: countError } = await supabase
      .from('cpu')
      .select('*', { count: 'exact', head: true });

    if (countError || count === null) {
      console.error('Error fetching row count:', countError);
      return;
    }

    const totalPages = Math.ceil(count / rowsPerPage);
    setTotalPages(totalPages);

    // Fetch paginated data
    const { data: rows, error } = await supabase
      .from('cpu') // Ensure this table name is correct
      .select('*')
      .range(page * rowsPerPage, (page + 1) * rowsPerPage - 1); // Correct range for pagination

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(rows || []); // Set empty array if rows is null
    }
  };

  const handlePageClick = (event: PageClickEvent) => {
    setPage(event.selected);
  };

  const handleRowClick = (row: TableRow) => {
    // Handle the row click, you can navigate to another page or perform an action
    console.log('Row clicked:', row);
  };

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            CPU
          </p>
        </div>

        <LogoCloud />

        <div>
          <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Core Count</th>
                <th>Core Clock</th>
                <th>Boost Clock</th>
                <th>Microarchitecture</th>
                <th>TDP</th>
                <th>Graphics</th>
              </tr>
            </thead>
            <tbody>
              {hasData ? (
                data.map((row) => (
                  <tr key={row.id}>
                    <td colSpan={8}>
         
