class ProductPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user.admin?
  end

  def add_stock?
    user.admin? || user.manager? || user.staff?
  end

  def reduce_stock?
    user.admin? || user.manager? || user.staff?
  end

  def adjust_stock?
    user.admin? || user.manager?
  end

  class Scope < Scope
    def resolve
      scope.all
    end
  end
end