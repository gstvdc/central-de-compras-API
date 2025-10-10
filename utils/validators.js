// Validators e middleware de validação com Joi
import Joi from 'joi';

// Middleware reutilizável para validar o body da requisição
const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: true, stripUnknown: true, convert: true });
  if (error) return res.status(400).json({ message: error.details[0].message });
  req.body = value;
  next();
};

// PRODUCT
const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().required(),
  stock_quantity: Joi.number().default(0),
  supplier_id: Joi.string().required(),
  status: Joi.string().valid('on', 'off').default('on')
}).required();

const productUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().optional(),
  stock_quantity: Joi.number().optional(),
  supplier_id: Joi.string().optional(),
  status: Joi.string().valid('on', 'off').optional()
}).required();

// ORDER
const orderItemSchema = Joi.object({
  product_id: Joi.string().required(),
  quantity: Joi.number().required(),
  campaign_id: Joi.string().allow(null).optional(),
  unit_price: Joi.number().optional()
}).required();

const orderCreateSchema = Joi.object({
  store_id: Joi.string().required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  total_amount: Joi.number().required(),
  status: Joi.string().valid('Pending', 'Shipped', 'Delivered').default('Pending'),
  date: Joi.string().isoDate().optional()
}).required();

const orderUpdateSchema = Joi.object({
  store_id: Joi.string().optional(),
  items: Joi.array().items(orderItemSchema).optional(),
  total_amount: Joi.number().optional(),
  status: Joi.string().valid('Pending', 'Shipped', 'Delivered').optional(),
  date: Joi.string().isoDate().optional()
}).required();

// USER
const userCreateSchema = Joi.object({
  name: Joi.string().optional(),
  contact_email: Joi.string().email().required(),
  user: Joi.string().min(3).required(),
  pwd: Joi.string().min(6).required(),
  level: Joi.string().optional(),
  status: Joi.string().valid('on', 'off').default('on')
}).required();

const userUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  contact_email: Joi.string().email().optional(),
  user: Joi.string().min(3).optional(),
  pwd: Joi.string().min(6).optional(),
  level: Joi.string().optional(),
  status: Joi.string().valid('on', 'off').optional()
}).required();

// SUPPLIER
const supplierCreateSchema = Joi.object({
  supplier_name: Joi.string().required(),
  supplier_category: Joi.string().optional(),
  contact_email: Joi.string().email().required(),
  phone_number: Joi.string().optional(),
  status: Joi.string().valid('on', 'off').default('on')
}).required();

const supplierUpdateSchema = Joi.object({
  supplier_name: Joi.string().optional(),
  supplier_category: Joi.string().optional(),
  contact_email: Joi.string().email().optional(),
  phone_number: Joi.string().optional(),
  status: Joi.string().valid('on', 'off').optional()
}).required();

// STORE
const storeCreateSchema = Joi.object({
  store_name: Joi.string().required(),
  cnpj: Joi.string().optional(),
  address: Joi.string().optional(),
  phone_number: Joi.string().optional(),
  contact_email: Joi.string().email().optional(),
  status: Joi.string().valid('on', 'off').default('on')
}).required();

const storeUpdateSchema = Joi.object({
  store_name: Joi.string().optional(),
  cnpj: Joi.string().optional(),
  address: Joi.string().optional(),
  phone_number: Joi.string().optional(),
  contact_email: Joi.string().email().optional(),
  status: Joi.string().valid('on', 'off').optional()
}).required();

// CAMPAIGN
const campaignCreateSchema = Joi.object({
  supplier_id: Joi.string().required(),
  name: Joi.string().required(),
  start_date: Joi.string().isoDate().optional(),
  end_date: Joi.string().isoDate().optional(),
  discount_percentage: Joi.number().min(0).max(100).required()
}).required();

const campaignUpdateSchema = Joi.object({
  supplier_id: Joi.string().optional(),
  name: Joi.string().optional(),
  start_date: Joi.string().isoDate().optional(),
  end_date: Joi.string().isoDate().optional(),
  discount_percentage: Joi.number().min(0).max(100).optional()
}).required();

export {
  validateBody,
  productCreateSchema,
  productUpdateSchema,
  orderCreateSchema,
  orderUpdateSchema,
  userCreateSchema,
  userUpdateSchema,
  supplierCreateSchema,
  supplierUpdateSchema,
  storeCreateSchema,
  storeUpdateSchema,
  campaignCreateSchema,
  campaignUpdateSchema,
};
