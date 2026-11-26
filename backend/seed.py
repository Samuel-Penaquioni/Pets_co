from passlib.context import CryptContext
from sqlalchemy.orm import Session
import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

PRODUTOS_INICIAIS = [
    ("Ração Premium 10kg", 189.90, "Alimentos", "Cães", True, "racao-premium-10kg",
     "Ração completa para cães adultos, pensada para uma alimentação equilibrada no dia a dia. Embalagem econômica de 10 kg.",
     "Embalagem de 10 kg\nPara cães adultos\nAlimento completo e balanceado\nArmazene em local fresco e seco"),
    ("Petisco Ossinho", 19.90, "Petiscos", "Cães", False, "petisco-ossinho",
     "Petisco em formato de ossinho para premiar seu cão nos treinos e nos momentos de carinho.",
     "Formato de ossinho\nIdeal para recompensas\nPara cães\nOferecer com moderação"),
    ("Bolinha Mordedor", 14.90, "Brinquedos", "Cães", False, "bolinha-mordedor",
     "Bolinha resistente para brincadeiras de buscar e morder, ajuda seu cão a gastar energia.",
     "Material resistente\nIdeal para buscar e morder\nFácil de limpar\nPara cães"),
    ("Caminha Confort", 99.90, "Conforto", "Cães", True, "caminha-confort",
     "Caminha macia e aconchegante para o seu cão descansar com conforto.",
     "Enchimento macio\nBorda para apoiar a cabeça\nFácil de lavar\nPara cães"),
    ("Shampoo Neutro", 29.90, "Higiene", "Cães", False, "shampoo-neutro",
     "Shampoo de fórmula neutra para banhos suaves, limpa sem agredir a pele e a pelagem.",
     "Fórmula neutra\nPara uso em cães\nAplicar, massagear e enxaguar bem\nEvite contato com os olhos"),
    ("Coleira + Guia", 49.90, "Acessórios", "Cães", False, "coleira-e-guia",
     "Conjunto de coleira e guia para passeios seguros e confortáveis.",
     "Coleira e guia no mesmo conjunto\nResistente\nPara cães\nConfira o tamanho antes de comprar"),
    ("Sachê Gatos (12un)", 39.90, "Alimentos", "Gatos", False, "sache-gatos-12un",
     "Caixa com 12 sachês para variar o cardápio do seu gato com praticidade.",
     "12 sachês por caixa\nPara gatos\nPorção individual, prática\nServir em temperatura ambiente"),
    ("Pelúcia Sonora", 24.90, "Brinquedos", "Cães", False, "pelucia-sonora",
     "Pelúcia com som para estimular a curiosidade e divertir seu cão.",
     "Emite som ao ser apertada\nMacia ao toque\nPara cães\nBrinque sempre com supervisão"),
    ("Ração Gatos Castrados 3kg", 79.90, "Alimentos", "Gatos", True, "racao-gatos-castrados-3kg",
     "Ração pensada para gatos castrados, ajuda a manter uma alimentação equilibrada.",
     "Embalagem de 3 kg\nPara gatos castrados\nAlimento completo\nArmazene em local fresco e seco"),
    ("Varinha com Penas", 17.90, "Brinquedos", "Gatos", False, "varinha-com-penas",
     "Varinha com penas que desperta o instinto caçador e diverte seu gato.",
     "Penas que estimulam a caça\nHaste leve\nPara gatos\nBrinque junto com seu gato"),
    ("Areia Higiênica 4kg", 22.90, "Higiene", "Gatos", False, "areia-higienica-4kg",
     "Areia higiênica para a caixinha do gato, em embalagem de 4 kg.",
     "Embalagem de 4 kg\nPara gatos\nTroque com regularidade\nMantenha a caixinha sempre limpa"),
    ("Escova Tira-Pelos", 34.90, "Higiene", "Cães", False, "escova-tira-pelos",
     "Escova para remover pelos soltos e manter a pelagem do seu cão limpa e macia.",
     "Remove pelos soltos\nPara cães\nFácil de limpar\nEscove com carinho e frequência"),
    ("Comedouro Antiformiga", 27.90, "Acessórios", "Ambos", False, "comedouro-antiformiga",
     "Comedouro com proteção contra formigas, para a comida ficar sempre limpa.",
     "Proteção antiformiga\nPara cães e gatos\nFácil de lavar\nBase estável"),
    ("Bifinho de Frango", 24.90, "Petiscos", "Cães", True, "bifinho-de-frango",
     "Bifinho sabor frango, um petisco irresistível para premiar seu cão.",
     "Sabor frango\nPara cães\nÓtimo para treinos\nOferecer com moderação"),
    ("Arranhador Compacto", 119.90, "Conforto", "Gatos", False, "arranhador-compacto",
     "Arranhador compacto para o gato afiar as unhas e ainda ter um cantinho de descanso.",
     "Tamanho compacto\nPara gatos\nAjuda a proteger sofás e móveis\nFácil de montar"),
    ("Fonte de Água", 89.90, "Acessórios", "Ambos", False, "fonte-de-agua",
     "Fonte de água que mantém a água circulando e estimula seu pet a beber mais.",
     "Água em movimento\nPara cães e gatos\nFácil de limpar\nFunciona ligada à tomada"),
]


def popular_banco_inicial(db: Session):
    # 1. Garante o administrador padrão (admin / petsco@2026)
    admin = db.query(models.Usuario).filter(models.Usuario.email == "admin").first()
    if not admin:
        db.add(models.Usuario(
            name="Administrador",
            email="admin",
            phone="",
            pass_hash=pwd_context.hash("petsco@2026"),
            role="admin",
        ))

    # 2. Popula produtos iniciais caso a tabela esteja vazia
    if db.query(models.Produto).count() == 0:
        for nome, preco, cat, pet, dest, foto, desc, carac in PRODUTOS_INICIAIS:
            db.add(models.Produto(
                nome=nome,
                preco=preco,
                categoria=cat,
                pet=pet,
                destaque=dest,
                foto=foto,
                descricao=desc,
                caracteristicas=carac,
            ))

    db.commit()