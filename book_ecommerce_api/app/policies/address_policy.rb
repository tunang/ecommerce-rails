class AddressPolicy < ApplicationPolicy
  def index?
    user.present?
  end

  def show?
    record.user == user
  end

  def create?
    user.present? || user.admin?
  end

  def update?
    record.user == user || user.admin?
  end

  def destroy?
    record.user == user || user.admin?
  end
end
