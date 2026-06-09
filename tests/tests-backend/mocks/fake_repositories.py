class FakeUserRepository:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)
        return item

    def list_all(self):
        return self.items

    def get_by_matricula(self, matricula):
        for item in self.items:
            if item.get("matricula") == matricula:
                return item
        return None
