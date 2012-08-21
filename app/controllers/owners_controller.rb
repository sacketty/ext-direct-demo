class OwnersController < ApplicationController
  include Rails::ExtJS::Direct::Controller

  # GET /owners
  # GET /owners.json
  def index
    @owners = Owner.all

    respond_to do |format|
      format.html # index.html.erb
      format.json do
        res = XResponse.new(@xrequest)
        res.status = true
        res.message = "Owner#list"
#    res.result = {:foo => 'bar'}
#        res.result = params['data'] ? Owner.limit(params['data']['limit']).offset(params['data']['start']) : Owner.all
        rows = params['data'] ? Owner.limit(params['data']['limit']).offset(params['data']['start']) : Owner.all
        res.result = {:owners=>rows, :total => Owner.count}
        render(:json => res)
      end
    end
  end

  # GET /owners/1
  # GET /owners/1.json
  def show
    @owner = Owner.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @owner }
    end
  end

  # GET /owners/new
  # GET /owners/new.json
  def new
    @owner = Owner.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @owner }
    end
  end

  # GET /owners/1/edit
  def edit
    @owner = Owner.find(params[:id])
  end

  # POST /owners
  # POST /owners.json
  def create
    attr = params['data'].dup
    attr.delete("id")
    @owner = Owner.new(attr)

    respond_to do |format|
      if @owner.save
        format.html { redirect_to @owner, notice: 'Owner was successfully created.' }
        format.json do
          res = XResponse.new(@xrequest)
          res.status = true
          res.message = "Owner#create"
          res.result = @owner
          render(:json => res)
        end
      else
        format.html { render action: "new" }
        format.json do
          res = XResponse.new(@xrequest)
          res.status = false
          res.message = @owner.errors.full_messages
          res.type = 'exception'
          res.errors = @owner.errors
          render(:json => res)
        end
      end
    end
  end

  # PUT /owners/1
  # PUT /owners/1.json
  def update
    @owner = Owner.find(params[:id])

    respond_to do |format|
      if @owner.update_attributes(params[:owner])
        format.html { redirect_to @owner, notice: 'Owner was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @owner.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /owners/1
  # DELETE /owners/1.json
  def destroy
    id = params[:data] ? params[:data][:id] : params[:id]
    @owner = Owner.find(id)
    @owner.destroy

    respond_to do |format|
      format.html { redirect_to owners_url }
      format.json do
        res = XResponse.new(@xrequest)
        res.status = true
        res.message = "Owner#destroy"
        render(:json => res)
      end
    end
  end
end
