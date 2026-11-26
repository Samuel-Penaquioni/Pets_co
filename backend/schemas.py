from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel


# --- Produtos ---
class ProdutoIn(BaseModel):
    nome: str
    preco: Decimal
    categoria: str
    pet: str
    destaque: bool = False
    foto: Optional[str] = ""
    descricao: Optional[str] = ""
    caracteristicas: Optional[str] = ""


class ProdutoOut(ProdutoIn):
    id: int

    class Config:
        from_attributes = True


# --- Pets ---
class PetIn(BaseModel):
    nome: str
    raca: Optional[str] = ""
    especie: str
    porte: int = 0


class PetOut(PetIn):
    id: int

    class Config:
        from_attributes = True


# --- Agendamentos ---
class AgendamentoIn(BaseModel):
    usuario_id: Optional[int] = None
    nome_tutor: str
    telefone: str
    tipo: str
    svc: str
    pet: str
    extra: Optional[str] = ""
    data: str
    hora: str
    obs: Optional[str] = ""


class AgendamentoOut(AgendamentoIn):
    id: int
    feito: bool

    class Config:
        from_attributes = True


# --- Pedidos ---
class ItemPedidoIn(BaseModel):
    produto_id: int
    q: int


class PedidoIn(BaseModel):
    usuario_id: int
    items: List[ItemPedidoIn]


class PedidoStatusIn(BaseModel):
    status: str


class PedidoItemOut(BaseModel):
    n: str
    q: int
    preco_unit: Decimal

    class Config:
        from_attributes = True


class PedidoOut(BaseModel):
    id: int
    codigo: str
    date: str
    total: Decimal
    status: str
    items: List[PedidoItemOut]

    class Config:
        from_attributes = True


# --- Usuários / Conta ---
class RegistroIn(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    senha: str


class LoginIn(BaseModel):
    email: str
    senha: str


class UsuarioUpdateIn(BaseModel):
    name: str
    phone: Optional[str] = ""


class UsuarioBaseOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = ""
    role: str

    class Config:
        from_attributes = True


class UsuarioCompletoOut(UsuarioBaseOut):
    pets: List[PetOut] = []
    appts: List[AgendamentoOut] = []
    orders: List[PedidoOut] = []


# --- Contato ---
class ContatoIn(BaseModel):
    nome: str
    email: str
    mensagem: str