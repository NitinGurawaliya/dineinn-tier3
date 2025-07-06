"use client"

import { useEffect, useState } from "react"
import { Search, MessageCircle, Filter, ChevronDown, ChevronUp, Phone, Mail, Calendar, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  const [selectedCustomers, setSelectedCustomers] = useState<Set<number>>(new Set())
  const [isBulkMessageDialogOpen, setIsBulkMessageDialogOpen] = useState(false)
  const [bulkMessage, setBulkMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isIndividualMessageDialogOpen, setIsIndividualMessageDialogOpen] = useState(false)
  const [individualMessage, setIndividualMessage] = useState("")
  const [selectedCustomerForMessage, setSelectedCustomerForMessage] = useState<Customer | null>(null)
  const [isSendingIndividual, setIsSendingIndividual] = useState(false)

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

  // Open individual message dialog
  const openIndividualMessageDialog = (customer: Customer) => {
    setSelectedCustomerForMessage(customer);
    setIndividualMessage("");
    setIsIndividualMessageDialogOpen(true);
  };

  // Send individual WhatsApp message using API
  const sendIndividualMessage = async () => {
    if (!selectedCustomerForMessage || !individualMessage.trim()) return;

    setIsSendingIndividual(true);

    try {
      const response = await fetch("/api/whatsapp/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          phone: selectedCustomerForMessage.mobile,
          message: individualMessage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      alert("Message sent successfully!");
      setIsIndividualMessageDialogOpen(false);
      setIndividualMessage("");
      setSelectedCustomerForMessage(null);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      alert(`Error sending message: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSendingIndividual(false);
    }
  };
  
  // Handle individual customer selection
  const handleCustomerSelection = (customerId: number, checked: boolean) => {
    const newSelected = new Set(selectedCustomers)
    if (checked) {
      newSelected.add(customerId)
    } else {
      newSelected.delete(customerId)
    }
    setSelectedCustomers(newSelected)
  }

  // Helper function to get filtered and sorted customers
  const getFilteredAndSortedCustomers = () => {
    return customers
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
  }

  // Handle select all functionality
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allCustomerIds = new Set(getFilteredAndSortedCustomers().map(customer => customer.id))
      setSelectedCustomers(allCustomerIds)
    } else {
      setSelectedCustomers(new Set())
    }
  }

  // Check if all filtered customers are selected
  const filteredCustomers = getFilteredAndSortedCustomers()
  const isAllSelected = filteredCustomers.length > 0 && filteredCustomers.every(customer => selectedCustomers.has(customer.id))

  // Send bulk message to selected customers using WhatsApp API
  const sendBulkMessage = async () => {
    if (!bulkMessage.trim() || selectedCustomers.size === 0) return

    setIsSending(true)
    
    try {
      const selectedCustomerIds = Array.from(selectedCustomers)
      
      const response = await fetch("/api/whatsapp/send-bulk-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          customerIds: selectedCustomerIds,
          message: bulkMessage,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send messages")
      }

      // Show success message with results
      const { summary } = result
      alert(`Messages sent successfully!\n\nTotal: ${summary.total}\nSuccessful: ${summary.successful}\nFailed: ${summary.failed}`)

      // Close dialog and reset
      setIsBulkMessageDialogOpen(false)
      setBulkMessage("")
      setSelectedCustomers(new Set())
      
    } catch (error) {
      console.error("Error sending bulk message:", error)
      alert(`Error sending messages: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSending(false)
    }
  }
  
  // Handle sorting
  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }



  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="m-6">
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>Manage your restaurant customers and contact them directly.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
            <Badge variant="outline" className="w-fit">
              {filteredCustomers.length} Customers
            </Badge>
              {selectedCustomers.size > 0 && (
                <Badge variant="secondary" className="w-fit">
                  {selectedCustomers.size} Selected
                </Badge>
              )}
            </div>
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

            <div className="flex gap-2">
              {selectedCustomers.size > 0 && (
                <Dialog open={isBulkMessageDialogOpen} onOpenChange={setIsBulkMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="w-full sm:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message ({selectedCustomers.size})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Send Bulk Message</DialogTitle>
                      <DialogDescription>
                        Send a message to {selectedCustomers.size} selected customer{selectedCustomers.size > 1 ? 's' : ''} via WhatsApp.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Enter your message here... This will be sent to all selected customers via WhatsApp."
                          value={bulkMessage}
                          onChange={(e) => setBulkMessage(e.target.value)}
                          rows={4}
                          maxLength={1000}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Message will be sent to {selectedCustomers.size} customer{selectedCustomers.size > 1 ? 's' : ''}</span>
                          <span>{bulkMessage.length}/1000</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBulkMessageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={sendBulkMessage} 
                        disabled={!bulkMessage.trim() || isSending}
                      >
                        {isSending ? "Sending..." : "Send via WhatsApp"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Individual Message Dialog */}
              <Dialog open={isIndividualMessageDialogOpen} onOpenChange={setIsIndividualMessageDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Send Message to {selectedCustomerForMessage?.name}</DialogTitle>
                    <DialogDescription>
                      Send a WhatsApp message to {selectedCustomerForMessage?.name} ({selectedCustomerForMessage?.mobile}).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="individual-message">Message</Label>
                      <Textarea
                        id="individual-message"
                        placeholder="Enter your message here..."
                        value={individualMessage}
                        onChange={(e) => setIndividualMessage(e.target.value)}
                        rows={4}
                        maxLength={1000}
                      />
                      <div className="flex justify-end text-xs text-muted-foreground">
                        <span>{individualMessage.length}/1000</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsIndividualMessageDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={sendIndividualMessage} 
                      disabled={!individualMessage.trim() || isSendingIndividual}
                    >
                      {isSendingIndividual ? "Sending..." : "Send via WhatsApp"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

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
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                    {selectedCustomers.size > 0 && !isAllSelected && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({selectedCustomers.size})
                      </span>
                    )}
                  </TableHead>
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
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No customers found. Try a different search term.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.has(customer.id)}
                          onCheckedChange={(checked) => handleCustomerSelection(customer.id, checked as boolean)}
                        />
                      </TableCell>
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
                          onClick={() => openIndividualMessageDialog(customer)}
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
