"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  checkAdmin,
  verifyAdminPassword,
  getOrders,
  updateOrderStatus,
} from "@/app/actions/orders";
import { getProducts, createProduct, deleteProduct, updateProductStock } from "@/app/actions/products";
import { getContactMessages } from "@/app/actions/contact";
import { getTeamMembers, createTeamMember, deleteTeamMember } from "@/app/actions/team";
import type { OrderRow, OrderItemsJSON } from "@/lib/types/order";
import { isNormalOrderItems } from "@/lib/types/order";
import type { ProductRow } from "@/lib/types/product";
import type { ContactMessageRow } from "@/lib/types/contact";
import type { TeamMemberRow } from "@/lib/types/team";
import { toast } from "sonner";
import {
  Loader2,
  Lock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  MessageSquare,
  Trash2,
  RefreshCw,
  Users,
} from "lucide-react";

// --- Sipariş yardımcıları ---
function OrderContent({ items }: { items: OrderItemsJSON }) {
  if (isNormalOrderItems(items)) {
    const lines = items.products.map(
      (p) => `${p.name} × ${p.quantity} ($${p.price})`
    );
    return (
      <div className="max-w-md space-y-0.5 text-sm">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div className="mt-1 font-medium">Total: ${items.totalPrice}</div>
      </div>
    );
  }
  return (
    <div className="max-w-md space-y-0.5 text-sm">
      <div><strong>Kategori:</strong> {items.category}</div>
      <div><strong>Detay:</strong> {items.productDetail}</div>
      {items.budgetRange && (
        <div><strong>Bütçe:</strong> {items.budgetRange}</div>
      )}
    </div>
  );
}

function OrderTypeBadge({ type }: { type: string }) {
  const isNormal = type === "normal_order";
  return (
    <Badge variant={isNormal ? "default" : "secondary"}>
      {isNormal ? "Mağaza siparişi" : "Özel tedarik"}
    </Badge>
  );
}

const STATUS_LABELS: Record<string, string> = {
  pending_approval: "Yeni gelen",
  approved_waiting: "Bekleyen",
  delivered: "Teslim edildi",
  rejected: "Reddedildi",
};

// --- Sipariş Yönetimi sekmesi ---
function AdminOrdersTab({
  orders,
  onUpdate,
  onRefresh,
}: {
  orders: OrderRow[];
  onUpdate: (id: string, status: OrderRow["status"]) => Promise<void>;
  onRefresh: () => void;
}) {
  const newOrders = orders.filter((o) => o.status === "pending_approval");
  const waiting = orders.filter((o) => o.status === "approved_waiting");
  const archive = orders.filter(
    (o) => o.status === "rejected" || o.status === "delivered"
  );

  const OrderRowActions = ({
    order,
    updatingId,
  }: {
    order: OrderRow;
    updatingId: string | null;
  }) => {
    const busy = updatingId === order.id;
    if (order.status === "pending_approval") {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={async () => {
              setUpdatingId(order.id);
              await onUpdate(order.id, "approved_waiting");
              setUpdatingId(null);
              onRefresh();
              toast.success("Sipariş onaylandı.");
            }}
            disabled={busy}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Onayla"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              setUpdatingId(order.id);
              await onUpdate(order.id, "rejected");
              setUpdatingId(null);
              onRefresh();
              toast.success("Sipariş reddedildi.");
            }}
            disabled={busy}
          >
            Reddet
          </Button>
        </div>
      );
    }
    if (order.status === "approved_waiting") {
      return (
        <Button
          size="sm"
          onClick={async () => {
            setUpdatingId(order.id);
            await onUpdate(order.id, "delivered");
            setUpdatingId(null);
            onRefresh();
            toast.success("Teslim edildi olarak işaretlendi.");
          }}
          disabled={busy}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : "Teslim Edildi"}
        </Button>
      );
    }
    return <span className="text-muted-foreground">—</span>;
  };

  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const TableSection = ({
    title,
    items,
    muted,
  }: {
    title: string;
    items: OrderRow[];
    muted?: boolean;
  }) => (
    <div className={muted ? "opacity-75" : ""}>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Kayıt yok.</p>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tür</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>İçerik</TableHead>
                <TableHead>Durum</TableHead>
                {!muted && <TableHead className="w-[200px]">İşlem</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((order) => (
                <TableRow key={order.id}>
                  <TableCell><OrderTypeBadge type={order.type} /></TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.phone}
                      {order.address && ` · ${order.address}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrderContent items={order.items as OrderItemsJSON} />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "success"
                          : order.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </TableCell>
                  {!muted && (
                    <TableCell>
                      <OrderRowActions order={order} updatingId={updatingId} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="size-4 mr-1" />
          Yenile
        </Button>
      </div>
      <TableSection title="Yeni Gelenler" items={newOrders} />
      <TableSection title="Bekleyen Siparişler" items={waiting} />
      <TableSection title="Arşiv (Reddedilenler & Teslim Edilenler)" items={archive} muted />
    </div>
  );
}

// --- Ürün Yönetimi sekmesi ---
function AdminProductsTab({
  products,
  onRefresh,
}: {
  products: ProductRow[];
  onRefresh: () => void;
}) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [updatingStockId, setUpdatingStockId] = React.useState<string | null>(null);
  const [stockInputs, setStockInputs] = React.useState<Record<string, number>>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setAdding(true);
    try {
      const result = await createProduct(formData);
      if (result.ok) {
        toast.success("Ürün eklendi.");
        form.reset();
        onRefresh();
      } else {
        toast.error(result.error ?? "Eklenemedi.");
      }
    } catch (err) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    const result = await deleteProduct(id);
    setDeletingId(null);
    if (result.ok) {
      toast.success("Ürün silindi.");
      onRefresh();
    } else {
      toast.error(result.error ?? "Silinemedi.");
    }
  };

  const handleStockUpdate = async (id: string) => {
    const product = products.find((p) => p.id === id);
    const value = stockInputs[id] ?? product?.stock ?? 0;
    setUpdatingStockId(id);
    const result = await updateProductStock(id, value);
    setUpdatingStockId(null);
    if (result.ok) {
      toast.success("Stok güncellendi.");
      onRefresh();
    } else {
      toast.error(result.error ?? "Güncellenemedi.");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Ürün Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product-name">Ürün adı</Label>
              <Input id="product-name" name="name" required placeholder="Örn: Klasik Gitar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-price">Price ($)</Label>
              <Input
                id="product-price"
                name="price"
                type="number"
                min={0}
                step={0.01}
                required
                placeholder="2499"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="product-desc">Açıklama (opsiyonel)</Label>
              <Textarea
                id="product-desc"
                name="description"
                rows={2}
                placeholder="Kısa açıklama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-category">Kategori</Label>
              <Input
                id="product-category"
                name="category"
                placeholder="Gitar, Mikrofon, vb."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-stock">Stok</Label>
              <Input
                id="product-stock"
                name="stock"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image">Ürün fotoğrafı</Label>
              <Input
                id="product-image"
                name="image"
                type="file"
                accept="image/*"
                className="cursor-pointer"
              />
            </div>
            <div className="flex items-end sm:col-span-2">
              <Button type="submit" disabled={adding}>
                {adding ? <Loader2 className="size-4 animate-spin" /> : "Ekle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-2 font-semibold">Ürün listesi</h3>
        {products.length === 0 ? (
          <p className="text-muted-foreground">Henüz ürün yok.</p>
        ) : (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Resim</TableHead>
                  <TableHead>İsim</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Açıklama</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="size-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded bg-muted text-muted-foreground">
                          <Package className="size-6" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          className="w-20"
                          defaultValue={p.stock ?? 0}
                          onChange={(e) =>
                            setStockInputs((prev) => ({
                              ...prev,
                              [p.id]: parseInt(e.target.value, 10) || 0,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockUpdate(p.id)}
                          disabled={updatingStockId === p.id}
                        >
                          {updatingStockId === p.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Güncelle"
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {p.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                      >
                        {deletingId === p.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Gelen Mesajlar sekmesi ---
function AdminMessagesTab({
  messages,
  onRefresh,
}: {
  messages: ContactMessageRow[];
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          İletişim sayfasından gelen mesajlar (salt okunur).
        </p>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="size-4 mr-1" />
          Yenile
        </Button>
      </div>
      {messages.length === 0 ? (
        <p className="text-muted-foreground">Henüz mesaj yok.</p>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell className="max-w-md whitespace-pre-wrap text-sm">
                    {m.message}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(m.created_at).toLocaleDateString("en-US")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// --- Ekibimiz sekmesi ---
function AdminTeamTab({
  members,
  onRefresh,
}: {
  members: TeamMemberRow[];
  onRefresh: () => void;
}) {
  const [adding, setAdding] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setAdding(true);
    try {
      const result = await createTeamMember(formData);
      if (result.ok) {
        toast.success("Ekip üyesi eklendi.");
        form.reset();
        onRefresh();
      } else {
        toast.error(result.error ?? "Eklenemedi.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
      toast.error(msg);
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ekip üyesini silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    const result = await deleteTeamMember(id);
    setDeletingId(null);
    if (result.ok) {
      toast.success("Ekip üyesi silindi.");
      onRefresh();
    } else {
      toast.error(result.error ?? "Silinemedi.");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Ekip Üyesi Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="team-name">İsim</Label>
              <Input
                id="team-name"
                name="name"
                required
                placeholder="Ad Soyad"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="team-bio">Kişi hakkında (detay)</Label>
              <Textarea
                id="team-bio"
                name="bio"
                rows={4}
                placeholder="Bu kişinin rolü, kısa tanıtım..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-image">Fotoğraf (3:4 oran önerilir)</Label>
              <Input
                id="team-image"
                name="image"
                type="file"
                accept="image/*"
                required
                className="cursor-pointer"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={adding}>
                {adding ? <Loader2 className="size-4 animate-spin" /> : "Ekle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-2 font-semibold">Ekip listesi</h3>
        {members.length === 0 ? (
          <p className="text-muted-foreground">Henüz ekip üyesi yok.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <Card key={m.id} className="overflow-hidden">
                <div className="aspect-[3/4] relative bg-muted">
                  {m.image_url ? (
                    <img
                      src={m.image_url}
                      alt={m.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <Users className="size-12" />
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{m.name}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                    >
                      {deletingId === m.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Ana Admin sayfası ---
export default function AdminPage() {
  const [authenticated, setAuthenticated] = React.useState<boolean | null>(null);
  const [password, setPassword] = React.useState("");
  const [orders, setOrders] = React.useState<OrderRow[]>([]);
  const [products, setProducts] = React.useState<ProductRow[]>([]);
  const [messages, setMessages] = React.useState<ContactMessageRow[]>([]);
  const [teamMembers, setTeamMembers] = React.useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loginError, setLoginError] = React.useState("");
  const [tab, setTab] = React.useState("orders");

  const loadTeamMembers = React.useCallback(async () => {
    const res = await getTeamMembers();
    if (res.ok && res.members) setTeamMembers(res.members);
  }, []);

  const loadOrders = React.useCallback(async () => {
    const res = await getOrders();
    if (res.ok && res.orders) setOrders(res.orders);
  }, []);

  const loadProducts = React.useCallback(async () => {
    const res = await getProducts();
    if (res.ok) setProducts(res.products);
  }, []);

  const loadMessages = React.useCallback(async () => {
    const res = await getContactMessages();
    if (res.ok && res.messages) setMessages(res.messages);
  }, []);

  React.useEffect(() => {
    checkAdmin().then(({ ok }) => {
      setAuthenticated(ok);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (!authenticated) return;
    loadOrders();
    loadProducts();
    loadMessages();
    loadTeamMembers();
  }, [authenticated, loadOrders, loadProducts, loadMessages, loadTeamMembers]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { ok } = await verifyAdminPassword(password);
    if (ok) {
      setAuthenticated(true);
      loadOrders();
      loadProducts();
      loadMessages();
      loadTeamMembers();
    } else {
      setLoginError("Şifre hatalı.");
    }
  };

  const handleOrderStatus = async (id: string, status: OrderRow["status"]) => {
    const res = await updateOrderStatus(id, status);
    if (!res.ok) toast.error(res.error ?? "Güncellenemedi.");
  };

  if (loading && authenticated === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-16">
        <div className="mb-6 flex items-center gap-2 text-muted-foreground">
          <Lock className="size-5" />
          <span>Yönetim Merkezi</span>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Şifre</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin şifresi"
              required
              autoFocus
            />
          </div>
          {loginError && <p className="text-sm text-destructive">{loginError}</p>}
          <Button type="submit" className="w-full">
            Giriş
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
        Yönetim Merkezi
      </h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 grid w-full max-w-2xl grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="orders" className="gap-2">
            <Package className="size-4" />
            Sipariş
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="size-4" />
            Ürünler
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="size-4" />
            Ekibimiz
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="size-4" />
            Mesajlar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <AdminOrdersTab
            orders={orders}
            onUpdate={handleOrderStatus}
            onRefresh={loadOrders}
          />
        </TabsContent>
        <TabsContent value="products">
          <AdminProductsTab products={products} onRefresh={loadProducts} />
        </TabsContent>
        <TabsContent value="team">
          <AdminTeamTab members={teamMembers} onRefresh={loadTeamMembers} />
        </TabsContent>
        <TabsContent value="messages">
          <AdminMessagesTab messages={messages} onRefresh={loadMessages} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
