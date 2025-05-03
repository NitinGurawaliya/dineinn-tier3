"use client"

import { useEffect, useState } from "react"
import { Search, MessageCircle, Filter, ChevronDown, ChevronUp, Phone, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"

interface Customer {
  id: number
  name: string
  mobile: string
  email: string
  DOB: string | null
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(()=>{
    const fetchCustomers = async()=>{
        const res = await fetch("/api/user",{
          credentials:"include"
        })
        const data = await res.json();
        setCustomers(data.customers)
      
    }
    fetchCustomers()
  },[])

  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Customer | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Format date to a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Open WhatsApp with the customer's number
  const messageOnWhatsApp = (mobile: string) => {
    // Clean the mobile number (remove any non-digit characters)
    const cleanMobile = mobile.replace(/\D/g, "");
  
    // Prepend +91 for India country code
    const formattedMobile = `+91${cleanMobile}`;
  
    // Open WhatsApp with the customer's number
    window.open(`https://wa.me/${formattedMobile}`, "_blank");
  };
  
  // Handle sorting
  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile.includes(searchTerm) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (!sortField) return 0

      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === null) return sortDirection === "asc" ? 1 : -1
      if (bValue === null) return sortDirection === "asc" ? -1 : 1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="m-6">
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>Manage your restaurant customers and contact them directly.</CardDescription>
            </div>
            <Badge variant="outline" className="w-fit">
              {filteredCustomers.length} Customers
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("name")}>Sort by Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("DOB")}>Sort by Date of Birth</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="inline ml-1 h-4 w-4" />
                      ))}
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("DOB")}>
                    Date of Birth
                    {sortField === "DOB" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="inline ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="inline ml-1 h-4 w-4" />
                      ))}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No customers found. Try a different search term.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{customer.mobile || "—"}</span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{customer.email}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {customer.DOB && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{formatDate(customer.DOB)}</span>
                          </div>
                        )}
                        {!customer.DOB && "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => messageOnWhatsApp(customer.mobile)}
                          className="h-8"
                        >
                          <MessageCircle className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
